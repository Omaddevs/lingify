import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircleDashed, Plus } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import ConversationList from '../components/ConversationList'
import ChatWindow from '../components/ChatWindow'
import { useUser } from '../context/UserContext'
import {
  getConversations,
  getMessages,
  sendMessage,
  subscribeToMessages,
  unsubscribe,
} from '../services/chatService'

export default function ChatPage() {
  const { user } = useUser()

  const [conversations, setConversations] = useState([])
  const [activeId,      setActiveId]      = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')

  const channelRef = useRef(null)   // current realtime subscription

  // ── Load conversation list ─────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return
    let cancelled = false

    async function load() {
      try {
        const list = await getConversations(user.id)
        if (!cancelled) setConversations(list)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [user?.id])

  // ── Load messages when conversation changes ────────────────────────────────
  useEffect(() => {
    if (!activeId || !user?.id) return
    let cancelled = false

    async function loadMsgs() {
      try {
        const msgs = await getMessages(activeId)
        const normalized = msgs.map((m) => ({ ...m, isSent: m.senderId === user.id }))
        if (!cancelled) {
          setConversations((prev) =>
            prev.map((c) => (c.id === activeId ? { ...c, messages: normalized, unread: 0 } : c)),
          )
        }
      } catch (err) {
        console.error('Failed to load messages:', err)
      }
    }
    loadMsgs()
    return () => { cancelled = true }
  }, [activeId, user?.id])

  // ── Realtime subscription ──────────────────────────────────────────────────
  useEffect(() => {
    unsubscribe(channelRef.current)
    if (!activeId || !user?.id) return

    channelRef.current = subscribeToMessages(activeId, (newMsg) => {
      const isSent = newMsg.sender_id === user.id
      const msgObj = {
        id:       newMsg.id,
        text:     newMsg.content,
        isSent,
        senderId: newMsg.sender_id,
        time:     new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        file:     newMsg.file_url ? { url: newMsg.file_url, type: newMsg.file_type, name: 'attachment' } : null,
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeId) return c
          const alreadyExists = c.messages.some((m) => m.id === msgObj.id)
          if (alreadyExists) return c
          return {
            ...c,
            messages: [...(c.messages ?? []), msgObj],
            preview:  newMsg.content,
            time:     msgObj.time,
            unread:   0,
          }
        }),
      )
    })

    return () => unsubscribe(channelRef.current)
  }, [activeId, user?.id])

  // ── Send message ───────────────────────────────────────────────────────────
  const handleSend = useCallback(
    async (convId, text, file = null) => {
      const content  = text ?? ''
      const fileUrl  = file?.url  ?? null
      const fileType = file?.type ?? null

      // Optimistic update
      const optimistic = {
        id:      `opt-${Date.now()}`,
        text:    content || (file?.name ?? '📎'),
        isSent:  true,
        time:    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        file:    file ?? null,
      }
      setConversations((prev) =>
        prev.map((c) =>
          c.id !== convId ? c : { ...c, messages: [...(c.messages ?? []), optimistic], preview: content, time: optimistic.time },
        ),
      )

      try {
        await sendMessage(convId, user.id, content, fileUrl, fileType)
        // Realtime will deliver the canonical row; optimistic stays until replaced
      } catch (err) {
        console.error('Send failed:', err)
        // Remove optimistic on failure
        setConversations((prev) =>
          prev.map((c) =>
            c.id !== convId ? c : { ...c, messages: c.messages.filter((m) => m.id !== optimistic.id) },
          ),
        )
      }
    },
    [user?.id],
  )

  const activeConversation = conversations.find((c) => c.id === activeId)

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="hidden xl:flex flex-shrink-0 px-4 py-5">
        <Sidebar />
      </div>

      <div className="flex flex-1 overflow-hidden py-5 pr-5 xl:pl-0 pl-4">
        <div className="flex w-full overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-md">

          {/* ── Conversation list ── */}
          <div
            className={`h-full flex-shrink-0 border-r border-slate-100 transition-all duration-300 ${
              activeId ? 'hidden md:flex md:flex-col w-[300px] lg:w-[340px]' : 'flex flex-col w-full md:w-[300px] lg:w-[340px]'
            }`}
          >
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
              </div>
            ) : error ? (
              <div className="flex h-full items-center justify-center p-4 text-center text-sm text-red-500">{error}</div>
            ) : (
              <ConversationList
                conversations={conversations}
                activeId={activeId}
                onSelect={setActiveId}
              />
            )}
          </div>

          {/* ── Chat window ── */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              {activeConversation ? (
                <motion.div
                  key={activeConversation.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                  className="flex h-full flex-col"
                >
                  {/* Mobile back */}
                  <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-4 py-2 md:hidden">
                    <button
                      onClick={() => setActiveId(null)}
                      className="text-xs font-medium text-indigo-600 hover:underline"
                    >
                      ← Back
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <ChatWindow
                      conversation={activeConversation}
                      onSend={handleSend}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hidden md:flex h-full flex-col items-center justify-center gap-4 text-slate-400 bg-slate-50/60"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-300">
                    <MessageCircleDashed size={40} />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-slate-600">Select a conversation</p>
                    <p className="mt-1 text-sm text-slate-400">Choose from your existing chats or start a new one</p>
                  </div>
                  <button className="mt-2 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700">
                    <Plus size={16} />
                    New Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}
