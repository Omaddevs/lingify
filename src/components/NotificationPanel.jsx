import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarClock, CheckCheck, MessageCircle, Settings, UserRound, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const tabs = ['All', 'Messages', 'Lessons', 'System', 'Mentions']

const seedNotifications = [
  {
    id: 'n1',
    type: 'Messages',
    title: 'Emma Johnson sent you a message',
    text: 'Hi! Nice to meet you too 👋',
    time: '2m ago',
    unread: true,
    href: '/messages',
  },
  {
    id: 'n2',
    type: 'System',
    title: 'David Smith liked your profile',
    text: 'You have a new like',
    time: '15m ago',
    unread: true,
    href: '/settings',
  },
  {
    id: 'n3',
    type: 'Mentions',
    title: 'You have a new match!',
    text: 'You and Sarah have liked each other.',
    time: '30m ago',
    unread: true,
    href: '/partner',
  },
  {
    id: 'n4',
    type: 'Lessons',
    title: 'Upcoming lesson reminder',
    text: 'Your lesson with James is at 7:00 PM.',
    time: '1h ago',
    unread: false,
    href: '/online-lessons',
  },
  {
    id: 'n5',
    type: 'System',
    title: 'Welcome to Lingify! 🎉',
    text: "Let's start your English learning journey.",
    time: '2h ago',
    unread: false,
    href: '/',
  },
]

const iconMap = {
  Messages: MessageCircle,
  Lessons: CalendarClock,
  System: UserRound,
  Mentions: Users,
}

function NotificationPanel({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('All')
  const [items, setItems] = useState(seedNotifications)

  const filtered = useMemo(() => {
    if (activeTab === 'All') return items
    return items.filter((item) => item.type === activeTab)
  }, [activeTab, items])

  function clearAll() {
    setItems([])
  }

  function markAllAsRead() {
    setItems((prev) => prev.map((item) => ({ ...item, unread: false })))
  }

  function openNotification(item) {
    setItems((prev) =>
      prev.map((entry) =>
        entry.id === item.id ? { ...entry, unread: false } : entry,
      ),
    )
    if (item.href) navigate(item.href)
    onClose?.()
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          className="absolute right-0 top-14 z-40 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200"
        >
          <div className="border-b border-slate-100 p-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Notifications</h3>
              <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <Settings size={16} />
              </button>
            </div>
            <div className="brand-scrollbar flex gap-1 overflow-x-auto pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                    activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="brand-scrollbar max-h-[380px] space-y-1 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="grid place-items-center rounded-xl bg-slate-50 p-8 text-center">
                <p className="text-sm font-medium text-slate-700">No notifications</p>
                <p className="text-xs text-slate-500">You are all caught up.</p>
              </div>
            ) : (
              filtered.map((item) => {
                const Icon = iconMap[item.type] || MessageCircle
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openNotification(item)}
                    className="flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition hover:bg-slate-50"
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-100 text-indigo-600">
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{item.text}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-slate-400">{item.time}</p>
                      {item.unread ? <span className="ml-auto mt-1 block h-2 w-2 rounded-full bg-indigo-500" /> : null}
                    </div>
                  </button>
                )
              })
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 p-2.5">
            <button type="button" onClick={clearAll} className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline">
              Clear all
            </button>
            <button type="button" onClick={markAllAsRead} className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline">
              <CheckCheck size={13} />
              Mark all as read
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default NotificationPanel
