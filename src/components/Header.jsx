import { Bell, Flame } from 'lucide-react'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import Avatar from './Avatar'

function Header({ title = 'Partner', subtitle = '', onRegisterClick }) {
  const { user } = useUser()

  return (
    <header className="mb-6 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRegisterClick}
          className="hidden h-10 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition duration-300 hover:bg-indigo-700 sm:flex"
        >
          Sign Up
        </motion.button>

        {/* Streak badge */}
        <div
          aria-label={`${user.streak}-day streak`}
          className="hidden items-center gap-2 rounded-2xl border border-orange-100 bg-white px-3 py-2 text-sm shadow-sm sm:flex"
        >
          <Flame size={16} className="text-orange-500" aria-hidden="true" />
          <div>
            <p className="font-semibold text-slate-900">{user.streak}</p>
            <p className="text-xs text-slate-500">Day streak</p>
          </div>
        </div>

        <motion.button
          type="button"
          aria-label="Open notifications"
          whileHover={{ scale: 1.05 }}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition duration-300 hover:text-indigo-600"
        >
          <Bell size={18} aria-hidden="true" />
        </motion.button>

        {/* Avatar — initials fallback, no external dependency at runtime */}
        <Avatar
          src={user.avatar}
          name={user.name ?? 'User'}
          size={40}
          className="border border-slate-100 rounded-xl shadow-sm"
        />
      </div>
    </header>
  )
}

export default Header
