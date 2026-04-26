import { motion } from 'framer-motion'
import { MapPin, MessageCircle, Wifi } from 'lucide-react'

function MatchResult({ onFindAnother }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-md"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xl font-semibold text-slate-900">Match found! ✅</p>
      </div>
      <div className="flex items-center gap-3">
        <img src="https://i.pravatar.cc/100?img=32" alt="Emma Johnson" className="h-14 w-14 rounded-2xl object-cover" />
        <div>
          <p className="font-semibold text-slate-900">Emma Johnson</p>
          <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">
            B1 Intermediate
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <MapPin size={14} />
          Uzbekistan
        </span>
        <span className="inline-flex items-center gap-1 text-emerald-600">
          <Wifi size={14} />
          Online now
        </span>
      </div>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 py-3 text-sm font-semibold text-white shadow-md transition duration-300 hover:shadow-lg"
      >
        <MessageCircle size={16} />
        Start Chat
      </motion.button>
      <button
        type="button"
        onClick={onFindAnother}
        className="mt-3 w-full text-center text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
      >
        Find another partner
      </button>
    </motion.article>
  )
}

export default MatchResult
