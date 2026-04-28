import { supabase, IS_DEMO } from '../lib/supabase'

// Demo conversations shown when Supabase is not configured
const DEMO_CONVERSATIONS = [
  { id: 'demo-1', name: 'Emma Johnson',  is_group: false, created_at: new Date().toISOString(), preview: "That's great! See you tomorrow 😊", time: '10:36 AM', unread: 2, online: true, lastSeen: 'Online now', avatar: null, group: false, messages: [{ id: 1, text: 'Hi! Nice to meet you 😊', isSent: false, time: '10:32 AM' }, { id: 2, text: 'What are your goals in learning English?', isSent: true, time: '10:33 AM' }, { id: 3, text: "That's great! See you tomorrow 😊", isSent: false, time: '10:36 AM' }] },
  { id: 'demo-2', name: 'Michael Lee',   is_group: false, created_at: new Date().toISOString(), preview: 'Can you send me the grammar notes?',   time: '09:15 AM', unread: 1, online: false, lastSeen: 'last seen 1h ago', avatar: null, group: false, messages: [{ id: 1, text: 'Can you send me the grammar notes?', isSent: false, time: '09:15 AM' }] },
  { id: 'demo-3', name: 'Study Buddies', is_group: true,  created_at: new Date().toISOString(), preview: "Let's practice speaking today",        time: 'May 20', unread: 5, online: false, lastSeen: '12 members',     avatar: null, group: true,  messages: [{ id: 1, text: "Let's practice speaking today", isSent: false, time: 'May 20' }] },
]

export async function getConversations(userId) {
  if (IS_DEMO) return DEMO_CONVERSATIONS

  const { data, error } = await supabase
    .from('conversation_participants')
    .select('conversation:conversations(id,name,is_group,created_at)')
    .eq('user_id', userId)
  if (error) throw error
  const convIds = data.map((d) => d.conversation.id)
  if (!convIds.length) return []
  const { data: latestMsgs } = await supabase.from('messages').select('conversation_id,content,created_at').in('conversation_id', convIds).order('created_at', { ascending: false })
  const latestByConv = {}
  for (const m of latestMsgs ?? []) { if (!latestByConv[m.conversation_id]) latestByConv[m.conversation_id] = m }
  return data.map(({ conversation }) => ({
    ...conversation,
    preview: latestByConv[conversation.id]?.content ?? 'No messages yet',
    time: latestByConv[conversation.id] ? new Date(latestByConv[conversation.id].created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
    messages: [], unread: 0, online: false, lastSeen: '', avatar: null, group: conversation.is_group,
  }))
}

export async function getMessages(conversationId) {
  if (IS_DEMO) return DEMO_CONVERSATIONS.find((c) => c.id === conversationId)?.messages ?? []
  const { data, error } = await supabase.from('messages').select('id,content,file_url,file_type,created_at,sender_id,sender:profiles!messages_sender_id_fkey(name,avatar_url)').eq('conversation_id', conversationId).order('created_at', { ascending: true })
  if (error) throw error
  return data.map((m) => ({ id: m.id, text: m.content, isSent: false, senderId: m.sender_id, senderName: m.sender?.name ?? 'Unknown', time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), file: m.file_url ? { url: m.file_url, type: m.file_type, name: 'attachment' } : null }))
}

export async function sendMessage(conversationId, senderId, content, fileUrl = null, fileType = null) {
  if (IS_DEMO) { console.info('[Demo] Message not persisted'); return { id: Date.now(), conversation_id: conversationId, sender_id: senderId, content, created_at: new Date().toISOString() } }
  const { data, error } = await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: senderId, content, file_url: fileUrl, file_type: fileType }).select().single()
  if (error) throw error
  return data
}

export function subscribeToMessages(conversationId, onNewMessage) {
  if (IS_DEMO) return null
  return supabase.channel(`messages:conv:${conversationId}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => onNewMessage(payload.new)).subscribe()
}

export function unsubscribe(channel) {
  if (!channel || IS_DEMO) return
  supabase.removeChannel(channel)
}

export async function createConversation(participantIds, name = null, isGroup = false) {
  if (IS_DEMO) throw new Error('Cannot create conversations in demo mode.')
  const { data: conv, error: convErr } = await supabase.from('conversations').insert({ name, is_group: isGroup }).select().single()
  if (convErr) throw convErr
  const { error: partErr } = await supabase.from('conversation_participants').insert(participantIds.map((uid) => ({ conversation_id: conv.id, user_id: uid })))
  if (partErr) throw partErr
  return conv
}
