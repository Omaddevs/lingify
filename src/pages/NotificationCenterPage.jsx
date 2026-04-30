import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, BookOpen, CheckCheck, ChevronRight,
  Flame, Gamepad2, MessageCircle, Star,
  Trophy, Trash2, Zap,
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Header from '../components/Header'

// ── Notification types ────────────────────────────────────────────────────────
const NOTIF_TYPES = {
  xp:       { icon: Zap,             color: 'bg-indigo-100 text-indigo-600', label: 'XP' },
  streak:   { icon: Flame,           color: 'bg-orange-100 text-orange-600', label: 'Streak' },
  lesson:   { icon: BookOpen,        color: 'bg-emerald-100 text-emerald-600', label: 'Dars' },
  test:     { icon: Trophy,          color: 'bg-violet-100 text-violet-600', label: 'Test' },
  message:  { icon: MessageCircle,   color: 'bg-sky-100 text-sky-600',       label: 'Xabar' },
  game:     { icon: Gamepad2,        color: 'bg-amber-100 text-amber-600',   label: 'O\'yin' },
  achievement:{ icon: Star,          color: 'bg-pink-100 text-pink-600',     label: 'Yutuq' },
}

// ── Mock notifications ────────────────────────────────────────────────────────
const INITIAL = [
  { id:1,  type:'streak',      read:false, time:'Hozirgina', title:'🔥 7 kunlik streak!',    body:'7 kun ketma-ket o\'qidingiz. Zo\'r natija!',            action:'/progress' },
  { id:2,  type:'xp',         read:false, time:'5 daqiqa',   title:'⚡ +50 XP topladingiz', body:'IELTS mock testni muvaffaqiyatli topshirdingiz.',       action:'/progress' },
  { id:3,  type:'lesson',     read:false, time:'2 soat',      title:'📖 Yangi dars qo\'shildi', body:'B2 darajasi uchun "Passive Voice Advanced" darsi qo\'shildi.',action:'/online-lessons'},
  { id:4,  type:'message',    read:true,  time:'3 soat',      title:'💬 Emma Johnson xabar yubordi', body:'Ertaga speaking sessiya qilamizmi?',              action:'/messages' },
  { id:5,  type:'achievement',read:true,  time:'Kecha',       title:'🏅 "10 ta dars" yutugi!', body:'Siz 10 ta darsni muvaffaqiyatli tugatdingiz.',       action:'/profile' },
  { id:6,  type:'test',       read:true,  time:'Kecha',       title:'📋 IELTS natijasi',       body:'Cambridge IELTS 11 Test 1 — Band: 6.5. Tabriklaydi!', action:'/progress' },
  { id:7,  type:'xp',         read:true,  time:'2 kun',       title:'⚡ +30 XP — Flashcard',  body:'10 ta so\'zni takrorladingiz va XP topladingiz.',      action:'/vocabulary' },
  { id:8,  type:'game',       read:true,  time:'2 kun',       title:'🎮 Rekord! Word Match',   body:'Siz Word Match o\'yinida rekord qo\'ydingiz: 10/10.',   action:'/games' },
  { id:9,  type:'lesson',     read:true,  time:'3 kun',       title:'📖 Dars eslatmasi',       body:'Siz "Modal Fe\'llar" darsini 3 kun o\'tmagan.  Davom eting!', action:'/lessons/b1-u2-l1' },
  { id:10, type:'achievement',read:true,  time:'1 hafta',     title:'💎 "500 XP" yutugi!',    body:'1000 XP ga yaqinlashmoqdasiz. Davom eting!',           action:'/profile' },
  { id:11, type:'message',    read:true,  time:'1 hafta',     title:'👥 Jasur Karimov ulandı', body:'Yangi speaking partneringiz bor.',                    action:'/partner' },
  { id:12, type:'streak',     read:true,  time:'2 hafta',     title:'🔥 3 kunlik streak!',     body:'Yaxshi boshlang\'ich! Davom eting.',                   action:'/progress' },
]

const FILTERS = ['Hammasi', 'O\'qilmagan', 'XP', 'Streak', 'Dars', 'Test', 'Xabar']

function NotifItem({ notif, onRead, onDelete, onNavigate }) {
  const meta = NOTIF_TYPES[notif.type] || NOTIF_TYPES.xp
  const Icon = meta.icon

  return (
    <motion.div layout initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, x:50, height:0 }}
      className={`group flex items-start gap-3 rounded-2xl border-2 p-4 transition cursor-pointer ${
        notif.read ? 'border-slate-100 bg-white' : 'border-indigo-200 bg-indigo-50/60'
      }`}
      onClick={() => { onRead(notif.id); onNavigate(notif.action) }}
    >
      {/* Icon */}
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.color}`}>
        <Icon size={18} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm ${notif.read ? 'font-semibold text-slate-800' : 'font-black text-slate-900'}`}>
            {notif.title}
          </p>
          {!notif.read && (
            <span className="shrink-0 h-2.5 w-2.5 rounded-full bg-indigo-600 mt-1" />
          )}
        </div>
        <p className="mt-0.5 text-xs text-slate-500 leading-5">{notif.body}</p>
        <p className="mt-1 text-[11px] text-slate-400">{notif.time} oldin</p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition">
        <ChevronRight size={14} className="text-slate-300" />
        <button onClick={(e) => { e.stopPropagation(); onDelete(notif.id) }}
          className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition">
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  )
}

function NotificationCenterPage() {
  const navigate = useNavigate()
  const [notifications, setNotifs] = useState(INITIAL)
  const [filter, setFilter] = useState('Hammasi')

  const unreadCount = notifications.filter((n) => !n.read).length

  function markRead(id) {
    setNotifs((p) => p.map((n) => n.id === id ? { ...n, read: true } : n))
  }
  function markAllRead() {
    setNotifs((p) => p.map((n) => ({ ...n, read: true })))
  }
  function deleteNotif(id) {
    setNotifs((p) => p.filter((n) => n.id !== id))
  }
  function clearAll() { setNotifs([]) }

  // Filter
  const TYPE_MAP = { 'XP':'xp', 'Streak':'streak', 'Dars':'lesson', 'Test':'test', 'Xabar':'message' }
  const filtered = notifications.filter((n) => {
    if (filter === 'Hammasi')     return true
    if (filter === 'O\'qilmagan') return !n.read
    return n.type === TYPE_MAP[filter]
  })

  // Group by time
  const groups = {}
  filtered.forEach((n) => {
    const key = ['Hozirgina','5 daqiqa','2 soat','3 soat'].includes(n.time) ? 'Bugun'
      : ['Kecha'].includes(n.time) ? 'Kecha' : 'Oldinroq'
    if (!groups[key]) groups[key] = []
    groups[key].push(n)
  })

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar />
        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">

          {/* Header */}
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">Bildirishnomalar</h1>
                {unreadCount > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-slate-500">Barcha faolliklaringiz bu yerda</p>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead}
                  className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition">
                  <CheckCheck size={13} />Barchasini o'qildi
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={clearAll}
                  className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition">
                  <Trash2 size={13} />Barchasini o'chirish
                </button>
              )}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((f) => {
              const count = f === 'O\'qilmagan' ? unreadCount : filtered.filter((n) => TYPE_MAP[f] ? n.type === TYPE_MAP[f] : true).length
              return (
                <button key={f} onClick={() => setFilter(f)}
                  className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs font-bold transition ${
                    filter === f ? 'bg-indigo-600 text-white shadow-md' : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
                  }`}>
                  {f}
                  {f === 'O\'qilmagan' && unreadCount > 0 && (
                    <span className="ml-1.5 rounded-full bg-white/30 px-1.5 py-0.5 text-[10px] font-black">{unreadCount}</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Notifications */}
          {notifications.length === 0 ? (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              className="flex flex-col items-center py-20 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <Bell size={36} className="text-slate-300" />
              </div>
              <p className="font-black text-slate-600">Hech qanday bildirishnoma yo'q</p>
              <p className="mt-1 text-sm text-slate-400">Faollik ko'rsatganingizda bu yerda paydo bo'ladi</p>
              <button onClick={() => navigate('/')}
                className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white">
                Bosh sahifaga →
              </button>
            </motion.div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="font-semibold">Bu filtr bo'yicha natija yo'q</p>
            </div>
          ) : (
            <div className="space-y-6 pb-16 xl:pb-0">
              <AnimatePresence>
                {Object.entries(groups).map(([group, items]) => (
                  <div key={group}>
                    <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">{group}</p>
                    <div className="space-y-2">
                      {items.map((n) => (
                        <NotifItem key={n.id} notif={n}
                          onRead={markRead}
                          onDelete={deleteNotif}
                          onNavigate={(path) => navigate(path)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default NotificationCenterPage
