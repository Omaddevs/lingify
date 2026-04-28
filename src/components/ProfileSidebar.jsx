import { motion } from 'framer-motion'
import { ChevronLeft, MoreHorizontal, MapPin, Wifi, CalendarDays, Star, MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function ProfileSidebar() {
  const navigate = useNavigate()

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full w-full flex-col overflow-y-auto rounded-[20px] border border-slate-100 bg-white shadow-sm"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
        >
          <ChevronLeft size={18} />
          Back
        </button>
        <button className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center px-5 pt-4 pb-5">
        <div className="relative">
          <img
            src="https://i.pravatar.cc/150?img=47"
            alt="Emma Johnson"
            className="h-28 w-28 rounded-full object-cover ring-4 ring-white shadow-md"
          />
          <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow" />
        </div>

        <h2 className="mt-4 text-xl font-extrabold text-slate-900">Emma Johnson</h2>

        {/* Badge */}
        <span className="mt-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
          B1 Intermediate
        </span>

        {/* Location + Status */}
        <div className="mt-4 flex items-center gap-5 text-sm">
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin size={14} className="text-slate-400" />
            <span>Uzbekistan</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-500 font-semibold">
            <Wifi size={14} />
            <span>Online now</span>
          </div>
        </div>
      </div>

      {/* About section */}
      <div className="mx-4 mb-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
        <p className="mb-2 text-sm font-bold text-slate-800">About Emma</p>
        <p className="text-sm leading-relaxed text-slate-500">
          I'm learning English to improve my speaking and confidence.
        </p>

        <div className="mt-4 space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <CalendarDays size={14} className="text-slate-400" />
              <span>Joined</span>
            </div>
            <span className="font-semibold text-slate-700">May 12, 2024</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Star size={14} className="text-slate-400" />
              <span>Learning Goal</span>
            </div>
            <span className="font-semibold text-slate-700">IELTS 6.0</span>
          </div>
        </div>
      </div>

      {/* Start Chat Button */}
      <div className="px-4 pb-2">
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(99,102,241,0.35)' }}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all duration-200"
        >
          <MessageCircle size={18} />
          Start Chat
        </motion.button>
      </div>

      {/* Find another partner */}
      <div className="px-4 pb-5 pt-3 text-center">
        <button className="text-sm font-bold text-indigo-600 transition hover:text-indigo-800 hover:underline underline-offset-2">
          Find another partner
        </button>
      </div>
    </motion.aside>
  )
}

export default ProfileSidebar
