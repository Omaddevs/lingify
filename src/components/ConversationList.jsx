import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCheck, Edit, Search, Users } from 'lucide-react'
import Avatar from './Avatar'

const tabs = ['All', 'Unread', 'Groups']

function ConversationList({ conversations = [], activeId, onSelect }) {
  const [search,    setSearch]    = useState('')
  const [activeTab, setActiveTab] = useState('All')

  const filtered = conversations.filter((c) => {
    const matchSearch = (c.name ?? '').toLowerCase().includes(search.toLowerCase())
    if (activeTab === 'Unread') return matchSearch && c.unread > 0
    if (activeTab === 'Groups') return matchSearch && c.group
    return matchSearch
  })

  return (
    <section aria-label="Conversations" className="flex h-full flex-col border-r border-slate-100 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
        <h2 className="text-lg font-bold text-slate-900">Messages</h2>
        <button
          type="button"
          aria-label="New conversation"
          className="grid h-8 w-8 place-items-center rounded-full text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
        >
          <Edit size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5">
        <label htmlFor="conv-search" className="sr-only">Search conversations</label>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="conv-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations…"
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Filter conversations" className="flex gap-1 px-3 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <ul role="list" className="flex-1 overflow-y-auto" aria-label="Conversation list">
        <AnimatePresence>
          {conversations.length === 0 ? (
            <li className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
              <Users size={32} className="opacity-30" aria-hidden="true" />
              <p className="text-sm font-medium">No conversations yet</p>
              <p className="text-xs text-slate-400">Find a partner to start chatting</p>
            </li>
          ) : filtered.length === 0 ? (
            <li className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
              <Search size={32} className="opacity-40" aria-hidden="true" />
              <p className="text-sm">No conversations found</p>
            </li>
          ) : (
            filtered.map((chat) => (
              <li key={chat.id}>
                <motion.button
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => onSelect(chat.id)}
                  type="button"
                  aria-label={`Open conversation with ${chat.name ?? 'group'}${chat.unread ? `, ${chat.unread} unread` : ''}`}
                  aria-pressed={activeId === chat.id}
                  className={`flex w-full items-center gap-3 px-3 py-3 text-left transition-colors ${
                    activeId === chat.id ? 'bg-indigo-50' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {chat.group ? (
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 text-white shadow-sm">
                        <Users size={18} aria-hidden="true" />
                      </div>
                    ) : (
                      <div className="relative">
                        <Avatar src={chat.avatar} name={chat.name ?? '?'} size={48} />
                        {chat.online && (
                          <span
                            aria-label="Online"
                            className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{chat.name ?? 'Conversation'}</p>
                      <span className="flex-shrink-0 text-[11px] text-slate-400">{chat.time}</span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-1">
                      <p className="truncate text-xs text-slate-500 leading-snug">{chat.preview}</p>
                      {chat.unread > 0 ? (
                        <span
                          aria-label={`${chat.unread} unread messages`}
                          className="flex-shrink-0 grid h-5 min-w-5 place-items-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white"
                        >
                          {chat.unread}
                        </span>
                      ) : (
                        <CheckCheck size={14} className="flex-shrink-0 text-slate-300" aria-hidden="true" />
                      )}
                    </div>
                  </div>
                </motion.button>
              </li>
            ))
          )}
        </AnimatePresence>
      </ul>
    </section>
  )
}

export default ConversationList
