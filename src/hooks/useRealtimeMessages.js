import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase, IS_DEMO } from '../lib/supabase'

// ─────────────────────────────────────────────────────────────────────────────
//  useRealtimeMessages
//  — In DEMO mode: uses localStorage (already implemented in MessagesPage)
//  — In REAL mode: subscribes to Supabase Realtime channel
// ─────────────────────────────────────────────────────────────────────────────
export function useRealtimeMessages(conversationId, userId) {
  const [messages,  setMessages]  = useState([])
  const [online,    setOnline]    = useState({})
  const [typing,    setTyping]    = useState(false)
  const channelRef = useRef(null)

  // ── DEMO mode ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (IS_DEMO || !conversationId) return

    // ── REAL mode: Supabase Realtime ─────────────────────────────────────
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      // New messages
      .on('postgres_changes', {
        event:  'INSERT',
        schema: 'public',
        table:  'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new])
      })
      // Typing indicator (broadcast)
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.user_id !== userId) {
          setTyping(true)
          setTimeout(() => setTyping(false), 2000)
        }
      })
      // Presence (online status)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setOnline(state)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: userId, online_at: new Date().toISOString() })
        }
      })

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, userId])

  // ── Load initial messages (REAL mode) ────────────────────────────────────
  useEffect(() => {
    if (IS_DEMO || !conversationId || !supabase) return

    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(100)
      .then(({ data }) => { if (data) setMessages(data) })
  }, [conversationId])

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    if (IS_DEMO || !supabase || !conversationId || !userId) return null
    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, sender_id: userId, content: text })
      .select()
      .single()
    return error ? null : data
  }, [conversationId, userId])

  // ── Send typing indicator ─────────────────────────────────────────────────
  const sendTyping = useCallback(() => {
    if (IS_DEMO || !channelRef.current) return
    channelRef.current.send({ type: 'broadcast', event: 'typing', payload: { user_id: userId } })
  }, [userId])

  // ── Mark messages as read ─────────────────────────────────────────────────
  const markRead = useCallback(async () => {
    if (IS_DEMO || !supabase || !conversationId) return
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .is('read_at', null)
  }, [conversationId, userId])

  return { messages, online, typing, sendMessage, sendTyping, markRead }
}
