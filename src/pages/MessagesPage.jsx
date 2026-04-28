import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Mic, MoreHorizontal, Paperclip, Phone, Search, SendHorizontal, Video, X } from 'lucide-react'
import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'
import { useUser } from '../context/UserContext'

const MSGS_KEY = 'lingify_messages'

const CONVERSATIONS_INIT = [
  { id: 1, name: 'Emma Johnson',    preview: 'Xayrli kun! 🌸', time: '10:27', unread: 2, online: true,  group: false },
  { id: 2, name: 'Study Buddies',   preview: 'Bugun speaking sessiya bor', time: '09:15', unread: 5, online: false, group: true },
  { id: 3, name: 'Michael Lee',     preview: 'Ha, hozir yuboraman.', time: 'Kecha', unread: 1, online: false, group: false },
  { id: 4, name: 'Sophia Martinez', preview: 'Great job on your mock test!', time: 'Kecha', unread: 0, online: false, group: false },
  { id: 5, name: 'IELTS Group',     preview: 'Emma: New material uploaded', time: '17-may', unread: 3, online: false, group: true },
]

const INIT_MESSAGES = {
  1: [
    { id: 'm1', from: 'them', text: 'Salom! 👋', time: '10:20' },
    { id: 'm2', from: 'them', text: 'Bugungi ingliz tili mashg\'uloti qanday o\'tdi?', time: '10:20' },
    { id: 'm3', from: 'me',   text: 'Salom Emma! Juda yaxshi! Ko\'p narsa o\'rgandim.', time: '10:22' },
    { id: 'm4', from: 'them', text: 'Zo\'r! Qaysi qismini ko\'proq yoqtirdingiz?', time: '10:23' },
    { id: 'm5', from: 'me',   text: 'Speaking mashg\'uloti juda foydali edi!', time: '10:24' },
    { id: 'm6', from: 'them', text: 'Menga ham! Ertaga birga mashq qilamizmi?', time: '10:25' },
    { id: 'm7', from: 'me',   text: 'Albatta! Ko\'rishguncha! 😄', time: '10:26' },
    { id: 'm8', from: 'them', text: 'Xayrli kun! 🌸', time: '10:27' },
  ],
  2: [
    { id: 'm1', from: 'them', text: 'Guruhga xush kelibsiz! 👋', time: '09:00' },
    { id: 'm2', from: 'them', text: 'Bugun speaking sessiya bor. Tayyor bo\'ling!', time: '09:10' },
    { id: 'm3', from: 'me',   text: 'Tayyor! Soat nechada?', time: '09:12' },
    { id: 'm4', from: 'them', text: '19:00 da. Link keyinroq yuboraman.', time: '09:15' },
  ],
  3: [
    { id: 'm1', from: 'them', text: 'Salom! Eslatmalarni yuborasizmi?', time: '09:00' },
    { id: 'm2', from: 'me',   text: 'Ha, hozir yuboraman.', time: '09:05' },
  ],
}

function loadMessages() {
  try { const r = localStorage.getItem(MSGS_KEY); return r ? JSON.parse(r) : { ...INIT_MESSAGES } }
  catch { return { ...INIT_MESSAGES } }
}
function saveMessages(m) { localStorage.setItem(MSGS_KEY, JSON.stringify(m)) }

function Avatar({ name, online, size = 36 }) {
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
  const bg = colors[name.charCodeAt(0) % colors.length]
  return (
    <div className="relative shrink-0">
      <div className="flex items-center justify-center rounded-full font-semibold text-white"
        style={{ width: size, height: size, background: bg, fontSize: size * 0.38 }}>
        {name[0]}
      </div>
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${online ? 'bg-emerald-500' : 'bg-slate-300'}`} />
      )}
    </div>
  )
}

function Bubble({ msg, partnerName }) {
  const isMe = msg.from === 'me'
  return (
    <div className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
      {!isMe && <Avatar name={partnerName} size={28} />}
      <div className={`max-w-[72%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
        isMe
          ? 'rounded-br-md bg-gradient-to-br from-indigo-500 to-indigo-700 text-white'
          : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'
      }`}>
        {msg.text}
        <p className={`mt-1 text-[10px] ${isMe ? 'text-indigo-200 text-right' : 'text-slate-400'}`}>{msg.time}</p>
      </div>
    </div>
  )
}

function MessagesPage() {
  const { user } = useUser()
  const [conversations, setConversations] = useState(CONVERSATIONS_INIT)
  const [allMessages, setAllMessages] = useState(loadMessages)
  const [activeId, setActiveId] = useState(1)
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')
  const [mobileShowChat, setMobileShowChat] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  const activeChat = useMemo(() => conversations.find((c) => c.id === activeId), [conversations, activeId])
  const messages   = useMemo(() => allMessages[activeId] || [], [allMessages, activeId])

  const filtered = useMemo(() =>
    conversations.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [conversations, search])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(() => {
    const text = draft.trim()
    if (!text) return
    const time = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    const msg  = { id: `m${Date.now()}`, from: 'me', text, time }

    setAllMessages((prev) => {
      const updated = { ...prev, [activeId]: [...(prev[activeId] || []), msg] }
      saveMessages(updated)
      return updated
    })
    setConversations((prev) =>
      prev.map((c) => c.id === activeId ? { ...c, preview: text, time } : c))
    setDraft('')
    inputRef.current?.focus()
  }, [draft, activeId])

  function openChat(id) {
    setActiveId(id)
    setMobileShowChat(true)
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, unread: 0 } : c))
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar />

        <main className="flex min-h-[calc(100vh-40px)] w-full flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-md">
          <div className="border-b border-slate-100 px-4 pt-4 md:px-6">
            <Header title="Xabarlar" subtitle="Partnerlar va do'stlaringiz bilan suhbatlashing 💜" />
          </div>

          <section className="grid flex-1 overflow-hidden xl:grid-cols-[340px_1fr]">
            {/* Conversation list */}
            <div className={`flex flex-col border-r border-slate-100 ${mobileShowChat ? 'hidden xl:flex' : 'flex'}`}>
              <div className="border-b border-slate-100 p-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Qidirish..."
                    className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-sm outline-none focus:border-indigo-300" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filtered.map((conv) => (
                  <button key={conv.id} onClick={() => openChat(conv.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${
                      activeId === conv.id ? 'border-l-2 border-indigo-500 bg-indigo-50/40' : 'border-l-2 border-transparent'
                    }`}>
                    <Avatar name={conv.name} online={conv.online} size={42} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-semibold text-slate-800">{conv.name}</p>
                        <span className="shrink-0 text-[11px] text-slate-400">{conv.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="truncate text-xs text-slate-500">{conv.preview}</p>
                        {conv.unread > 0 && (
                          <span className="ml-2 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat window */}
            <div className={`flex flex-col ${mobileShowChat ? 'flex' : 'hidden xl:flex'}`}>
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
                {mobileShowChat && (
                  <button onClick={() => setMobileShowChat(false)} className="xl:hidden mr-1 text-slate-400">
                    <X size={18} />
                  </button>
                )}
                <Avatar name={activeChat?.name || 'U'} online={activeChat?.online} size={38} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{activeChat?.name}</p>
                  <p className="text-xs text-slate-400">
                    {activeChat?.online ? '🟢 Onlayn' : 'Oxirgi faollik: kecha'}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {[Phone, Video, MoreHorizontal].map((Icon, i) => (
                    <button key={i} className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition">
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 px-4 py-4 bg-slate-50/30">
                {messages.map((msg) => (
                  <Bubble key={msg.id} msg={msg} partnerName={activeChat?.name || 'U'} />
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-slate-100 bg-white p-3">
                <div className="flex items-end gap-2">
                  <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition">
                    <Paperclip size={15} />
                  </button>
                  <textarea ref={inputRef} value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                    placeholder="Xabar yozing..."
                    rows={1}
                    className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-300 focus:bg-white transition"
                    style={{ maxHeight: 100 }}
                  />
                  <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition">
                    <Mic size={15} />
                  </button>
                  <button onClick={sendMessage} disabled={!draft.trim()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed">
                    <SendHorizontal size={15} />
                  </button>
                </div>
                <p className="mt-1 text-center text-[10px] text-slate-300">Enter — yuborish · Shift+Enter — yangi qator</p>
              </div>
            </div>
          </section>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default MessagesPage
