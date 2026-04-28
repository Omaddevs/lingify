import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, Settings, UserCircle2, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'

function UserAvatar({ user, profile, onGuestClick, onLogout }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const isAuthenticated = !!user
  const avatarUrl = profile?.avatar_url || user?.avatar_url || user?.avatar || null
  const name = profile?.name || user?.name || 'Guest'
  const initial = useMemo(() => (name?.trim()?.[0] || 'G').toUpperCase(), [name])

  if (!isAuthenticated) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        title="Sign in to personalize your experience"
        onClick={onGuestClick}
        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600"
      >
        <div className="grid h-7 w-7 place-items-center rounded-full bg-white text-slate-500">
          <UserRound size={14} />
        </div>
        Guest
      </motion.button>
    )
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full"
      >
        {avatarUrl ? (
          <Avatar src={avatarUrl} name={name} size={40} className="border border-slate-100 shadow-sm" />
        ) : (
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white shadow-sm">
            {initial}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="absolute right-0 top-12 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                navigate('/settings')
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <UserCircle2 size={15} />
              Profile
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                navigate('/settings')
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <Settings size={15} />
              Settings
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onLogout?.()
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={15} />
              Logout
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default UserAvatar
