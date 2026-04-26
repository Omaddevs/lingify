import { useMemo, useState } from 'react'
import {
  Menu,
  Mic,
  MoreHorizontal,
  Paperclip,
  Phone,
  Search,
  SendHorizontal,
  SlidersHorizontal,
  Video,
} from 'lucide-react'
import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'

const inboxTabs = ['All', 'Unread', 'Favorites', 'Groups']

const conversations = [
  {
    id: 1,
    name: 'Emma Johnson',
    preview: 'Thanks! That was helpful',
    time: '10:30 AM',
    unread: 2,
    avatar: 'https://i.pravatar.cc/100?img=32',
    online: true,
  },
  {
    id: 2,
    name: 'Study Buddies',
    preview: "John: Let's practice speaking today",
    time: '09:15 AM',
    unread: 5,
    avatar: '',
    online: false,
    group: true,
  },
  {
    id: 3,
    name: 'Michael Lee',
    preview: 'Can you send me the notes?',
    time: 'Yesterday',
    unread: 1,
    avatar: 'https://i.pravatar.cc/100?img=14',
    online: false,
  },
  {
    id: 4,
    name: 'Sophia Martinez',
    preview: 'Great job on your mock test!',
    time: 'Yesterday',
    unread: 0,
    avatar: 'https://i.pravatar.cc/100?img=26',
    online: false,
  },
  {
    id: 5,
    name: 'IELTS Group',
    preview: 'Emma: New material uploaded',
    time: 'May 17',
    unread: 3,
    avatar: '',
    online: false,
    group: true,
  },
]

const messages = [
  { id: '1', from: 'them', text: 'Hi Asadbek! 👋', time: '10:20 AM' },
  { id: '2', from: 'them', text: 'How was your English practice today?', time: '10:20 AM' },
  { id: '3', from: 'me', text: 'Hi Emma! It was great! I learned a lot from the lesson.', time: '10:22 AM' },
  { id: '4', from: 'them', text: "That's awesome! Which part did you like the most?", time: '10:23 AM' },
  { id: '5', from: 'me', text: 'I really enjoyed the speaking practice. It helped me a lot!', time: '10:24 AM' },
  { id: '6', from: 'them', text: "Same here! Let's practice together tomorrow?", time: '10:25 AM' },
  { id: '7', from: 'me', text: 'Sure! See you then! 😄', time: '10:26 AM' },
  { id: '8', from: 'them', text: 'Great! Have a nice day! 🌸', time: '10:27 AM' },
]

function MessagesPage() {
  const [activeId, setActiveId] = useState(1)
  const [draft, setDraft] = useState('')
  const activeChat = useMemo(() => conversations.find((c) => c.id === activeId), [activeId])

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar activeItem="Messages" />

        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header title="Messages" subtitle="Connect, chat and grow together 💜" />

          <section className="grid gap-4 xl:grid-cols-[340px_1fr]">
            <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-3">
                <div className="mb-3 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      placeholder="Search messages..."
                      className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-sm outline-none focus:border-indigo-300"
                    />
                  </div>
                  <button className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500">
                    <SlidersHorizontal size={15} />
                  </button>
                </div>
                <div className="flex gap-2">
                  {inboxTabs.map((tab, index) => (
                    <button
                      key={tab}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                        index === 0 ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-h-[590px] space-y-1 overflow-y-auto p-2">
                {conversations.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setActiveId(chat.id)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                      activeId === chat.id ? 'bg-indigo-50' : 'hover:bg-slate-50'
                    }`}
                    type="button"
                  >
                    {chat.group ? (
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
                        <Mic size={16} />
                      </div>
                    ) : (
                      <div className="relative">
                        <img src={chat.avatar} alt={chat.name} className="h-11 w-11 rounded-xl object-cover" />
                        {chat.online ? (
                          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                        ) : null}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-slate-800">{chat.name}</p>
                        <span className="text-[11px] text-slate-400">{chat.time}</span>
                      </div>
                      <p className="truncate text-xs text-slate-500">{chat.preview}</p>
                    </div>
                    {chat.unread > 0 ? (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-indigo-600 px-1 text-[11px] font-semibold text-white">
                        {chat.unread}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-100 p-3">
                <button className="w-full rounded-xl border border-slate-200 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
                  + New Message
                </button>
              </div>
            </article>

            <article className="flex min-h-[720px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <div className="flex items-center gap-3">
                  <button className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 md:hidden">
                    <Menu size={15} />
                  </button>
                  <img src={activeChat?.avatar || 'https://i.pravatar.cc/100?img=32'} alt={activeChat?.name} className="h-11 w-11 rounded-xl object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{activeChat?.name}</p>
                    <p className="text-xs text-emerald-600">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600">
                    <Phone size={15} />
                  </button>
                  <button className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600">
                    <Video size={15} />
                  </button>
                  <button className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600">
                    <MoreHorizontal size={15} />
                  </button>
                </div>
              </div>

              <div className="border-b border-slate-100 bg-indigo-50/60 px-4 py-2.5 text-xs text-indigo-700">
                Keep going! You&apos;re both on a 12-day streak 🔥
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/60 p-4">
                <p className="text-center text-xs text-slate-400">Today</p>
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                        message.from === 'me'
                          ? 'rounded-br-md bg-gradient-to-r from-indigo-500 to-indigo-700 text-white'
                          : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`mt-1 text-[11px] ${message.from === 'me' ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 p-3">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2">
                  <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100">
                    <Paperclip size={16} />
                  </button>
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Type a message..."
                    className="h-8 flex-1 bg-transparent px-1 text-sm text-slate-700 outline-none"
                  />
                  <button className="inline-flex h-8 items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-700 px-3 text-xs font-semibold text-white transition hover:scale-[1.03]">
                    <SendHorizontal size={13} />
                    Send
                  </button>
                </div>
              </div>
            </article>
          </section>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default MessagesPage
