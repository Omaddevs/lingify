import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Paperclip, Phone, Search, SendHorizontal, Video } from 'lucide-react'

const chatList = [
  {
    id: 1,
    name: 'Emma Johnson',
    level: 'B1 Intermediate',
    lastMessage: 'Great! Let us practice speaking part 2 today.',
    time: '11:45 AM',
    unread: 2,
    avatar: 'https://i.pravatar.cc/80?img=32',
    online: true,
  },
  {
    id: 2,
    name: 'Michael Lee',
    level: 'B2 Upper-Intermediate',
    lastMessage: 'I sent you useful vocabulary notes.',
    time: '10:10 AM',
    unread: 0,
    avatar: 'https://i.pravatar.cc/80?img=54',
    online: false,
  },
  {
    id: 3,
    name: 'Sophie Carter',
    level: 'B1 Intermediate',
    lastMessage: 'Can we schedule a call for tonight?',
    time: 'Yesterday',
    unread: 1,
    avatar: 'https://i.pravatar.cc/80?img=47',
    online: true,
  },
]

const messagesByUser = {
  1: [
    { id: 'm1', from: 'them', text: 'Hi Asadbek! Ready for IELTS practice today?', time: '11:30' },
    { id: 'm2', from: 'me', text: 'Yes, absolutely. Let us focus on speaking task 2.', time: '11:33' },
    { id: 'm3', from: 'them', text: 'Perfect. I prepared 5 cue cards for us.', time: '11:40' },
    { id: 'm4', from: 'them', text: 'Great! Let us practice speaking part 2 today.', time: '11:45' },
  ],
  2: [
    { id: 'm1', from: 'them', text: 'I sent you useful vocabulary notes.', time: '10:10' },
    { id: 'm2', from: 'me', text: 'Thanks, I will review them before class.', time: '10:13' },
  ],
  3: [
    { id: 'm1', from: 'them', text: 'Can we schedule a call for tonight?', time: 'Yesterday' },
    { id: 'm2', from: 'me', text: 'Sure, 8:30 PM works for me.', time: 'Yesterday' },
  ],
}

function MyChatsPanel() {
  const [activeChatId, setActiveChatId] = useState(1)
  const [draft, setDraft] = useState('')
  const activeUser = useMemo(() => chatList.find((chat) => chat.id === activeChatId), [activeChatId])
  const activeMessages = messagesByUser[activeChatId] ?? []

  return (
    <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white"
              placeholder="Search chats..."
            />
          </div>
        </div>

        <div className="max-h-[540px] space-y-1 overflow-y-auto p-2">
          {chatList.map((chat) => (
            <motion.button
              key={chat.id}
              type="button"
              whileHover={{ scale: 1.01 }}
              onClick={() => setActiveChatId(chat.id)}
              className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
                activeChatId === chat.id ? 'bg-indigo-50' : 'hover:bg-slate-50'
              }`}
            >
              <div className="relative">
                <img src={chat.avatar} alt={chat.name} className="h-11 w-11 rounded-xl object-cover" />
                {chat.online ? (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-slate-800">{chat.name}</p>
                  <span className="text-[11px] text-slate-400">{chat.time}</span>
                </div>
                <p className="mt-0.5 text-xs text-indigo-600">{chat.level}</p>
                <p className="mt-1 truncate text-xs text-slate-500">{chat.lastMessage}</p>
              </div>
              {chat.unread ? (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-indigo-600 px-1 text-[11px] font-semibold text-white">
                  {chat.unread}
                </span>
              ) : null}
            </motion.button>
          ))}
        </div>
      </article>

      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <img src={activeUser?.avatar} alt={activeUser?.name} className="h-11 w-11 rounded-xl object-cover" />
            <div>
              <p className="text-sm font-semibold text-slate-800">{activeUser?.name}</p>
              <p className="text-xs text-slate-500">{activeUser?.online ? 'Online now' : 'Offline'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600">
              <Phone size={15} />
            </button>
            <button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600">
              <Video size={15} />
            </button>
          </div>
        </div>

        <div className="max-h-[440px] space-y-3 overflow-y-auto bg-gradient-to-b from-white to-slate-50 p-4">
          {activeMessages.map((message) => (
            <div key={message.id} className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  message.from === 'me'
                    ? 'rounded-br-md bg-gradient-to-r from-indigo-500 to-indigo-700 text-white'
                    : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'
                }`}
              >
                <p>{message.text}</p>
                <p className={`mt-1 text-[11px] ${message.from === 'me' ? 'text-indigo-100' : 'text-slate-400'}`}>{message.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2">
            <button type="button" className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100">
              <Paperclip size={16} />
            </button>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="h-8 flex-1 bg-transparent px-2 text-sm text-slate-700 outline-none"
              placeholder="Type a message..."
            />
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-700 px-3 text-xs font-semibold text-white transition hover:scale-[1.03]"
            >
              <SendHorizontal size={13} />
              Send
            </button>
          </div>
        </div>
      </article>
    </section>
  )
}

export default MyChatsPanel
