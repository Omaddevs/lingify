import {
  AudioWaveform,
  BookOpenCheck,
  Headphones,
  House,
  Languages,
  PenLine,
  Settings,
  Sparkles,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const quickMenuItems = [
  { label: 'Grammar', icon: Languages, path: '/online-lessons' },
  { label: 'Listening', icon: Headphones, path: '/mock-exam' },
  { label: 'Pronunciation', icon: AudioWaveform, path: '/partner', active: true },
  { label: 'Writing', icon: PenLine, path: '/mock-exam' },
  { label: 'Reading', icon: BookOpenCheck, path: '/online-lessons' },
]

const bottomNavItems = [
  { label: 'Home', icon: House, path: '/' },
  { label: 'Partner', icon: UsersRound, path: '/partner' },
  { label: 'Center', icon: Sparkles, path: null, center: true },
  { label: 'Lessons', icon: BookOpenCheck, path: '/online-lessons' },
  { label: 'Settings', icon: Settings, path: '/settings' },
]

function MobileBottomNav({ locked = false, onLockedClick }) {
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false)

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-4 bottom-4 z-50 space-y-3 xl:hidden"
    >
      <AnimatePresence initial={false}>
        {isQuickMenuOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="grid grid-cols-5 gap-2 rounded-3xl border border-white/80 bg-white/95 p-3 shadow-card backdrop-blur"
            role="list"
          >
          {quickMenuItems.map(({ label, icon: Icon, path, active }) => (
            <li key={label}>
              {locked ? (
                <button
                  type="button"
                  title="Sign up to access"
                  onClick={onLockedClick}
                  className="flex w-full flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-slate-400"
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ) : (
                <NavLink
                  to={path}
                  className={`flex w-full flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition ${
                    active ? 'text-indigo-700' : 'text-slate-500 hover:text-indigo-600'
                  }`}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>{label}</span>
                  <span className={`h-0.5 w-5 rounded-full ${active ? 'bg-indigo-600' : 'bg-transparent'}`} />
                </NavLink>
              )}
            </li>
          ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <ul className="grid grid-cols-5 gap-1 rounded-3xl border border-white/80 bg-white/95 p-2 shadow-card backdrop-blur" role="list">
        {bottomNavItems.map(({ label, icon: Icon, path }) => (
          <li key={label}>
            {path === null ? (
              <button
                type="button"
                aria-label={isQuickMenuOpen ? 'Quick menu yopish' : 'Quick menu ochish'}
                onClick={() => setIsQuickMenuOpen((v) => !v)}
                className="mx-auto -mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-xl"
              >
                <Icon size={22} aria-hidden="true" />
              </button>
            ) : locked ? (
              <button
                type="button"
                title="Sign up to access"
                onClick={onLockedClick}
                className="flex w-full flex-col items-center gap-1 rounded-lg py-2 text-[11px] font-medium text-slate-400"
              >
                <Icon size={16} aria-hidden="true" />
                <span>{label}</span>
              </button>
            ) : (
              <NavLink
                to={path}
                end={path === '/'}
                aria-label={label}
                className={({ isActive }) =>
                  `flex w-full flex-col items-center gap-1 rounded-lg py-2 text-[11px] font-medium transition ${
                    isActive ? 'text-indigo-700' : 'text-slate-500 hover:text-indigo-600'
                  }`
                }
              >
                <Icon size={16} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MobileBottomNav
