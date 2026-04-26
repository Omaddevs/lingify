import { Bell, Flame } from 'lucide-react'
import { motion } from 'framer-motion'

function Header({ title = 'Partner', subtitle = '' }) {
  return (
    <header className="mb-6 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-2xl border border-orange-100 bg-white px-3 py-2 text-sm shadow-sm sm:flex">
          <Flame size={16} className="text-orange-500" />
          <div>
            <p className="font-semibold text-slate-900">12</p>
            <p className="text-xs text-slate-500">Day streak</p>
          </div>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition duration-300 hover:text-indigo-600"
        >
          <Bell size={18} />
        </motion.button>
        <img
          src="https://i.pravatar.cc/80?img=12"
          alt="Profile avatar"
          className="h-10 w-10 rounded-xl border border-slate-100 object-cover shadow-sm"
        />
      </div>
    </header>
  )
}

export default Header
