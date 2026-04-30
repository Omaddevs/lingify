import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Gamepad2, Home, Search } from 'lucide-react'

const QUICK_LINKS = [
  { icon: Home,     label: 'Bosh sahifa',   path: '/' },
  { icon: BookOpen, label: 'Darslar',        path: '/online-lessons' },
  { icon: Gamepad2, label: 'O\'yinlar',      path: '/games' },
  { icon: Search,   label: 'Qidirish',       path: '/search' },
]

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-900">
      {/* Animated 404 */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="mb-6 text-center"
      >
        <div className="relative inline-block">
          <span
            className="select-none bg-gradient-to-br from-indigo-500 to-violet-600 bg-clip-text text-[130px] font-black leading-none tracking-tighter text-transparent md:text-[180px]"
          >
            404
          </span>
          {/* Floating emoji */}
          {['📚','🎮','🎤','⚡'].map((e, i) => (
            <motion.span
              key={e}
              className="absolute text-3xl"
              style={{
                top:  `${[10, 5, 60, 65][i]}%`,
                left: `${[-10, 85, -15, 90][i]}%`,
              }}
              animate={{ y: [0, -8, 0], rotate: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 2.5 + i * 0.4, ease: 'easeInOut' }}
            >
              {e}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-center"
      >
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Sahifa topilmadi
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.
        </p>

        {/* Quick links */}
        <div className="mt-8 grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {QUICK_LINKS.map(({ icon: Icon, label, path }) => (
            <motion.button
              key={path}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(path)}
              className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <Icon size={16} className="text-indigo-500" />
              {label}
            </motion.button>
          ))}
        </div>

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate(-1)}
          className="mt-6 flex items-center gap-2 mx-auto text-sm font-semibold text-slate-400 hover:text-indigo-600 transition"
        >
          <ArrowLeft size={15} />
          Orqaga qaytish
        </motion.button>
      </motion.div>
    </div>
  )
}
