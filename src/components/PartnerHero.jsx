import { motion } from 'framer-motion'
import { Handshake } from 'lucide-react'

function PartnerHero({ onFindPartner, isLoading }) {
  return (
    <section className="overflow-hidden rounded-[20px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-100 p-6 shadow-md">
      <div className="grid items-center gap-5 lg:grid-cols-2">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900">Find a study partner</h2>
          <p className="mt-3 max-w-md text-sm text-slate-600">
            We will find the best partner for you in seconds.
          </p>
          <motion.button
            type="button"
            onClick={onFindPartner}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition duration-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-80"
          >
            <Handshake size={16} />
            {isLoading ? 'Finding...' : 'Find Partner'}
          </motion.button>
        </div>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative ml-auto h-44 w-full max-w-md rounded-2xl bg-white/45 p-4 backdrop-blur-sm"
        >
          <div className="absolute left-7 top-8 h-24 w-24 rounded-full bg-indigo-300/35" />
          <div className="absolute right-8 top-6 h-24 w-24 rounded-full bg-violet-300/35" />
          <div className="absolute bottom-3 left-1/2 h-24 w-48 -translate-x-1/2 rounded-full bg-indigo-200/30 blur-sm" />
          <div className="relative z-10 flex h-full items-end justify-center gap-6">
            <div className="h-28 w-24 rounded-[40px] rounded-b-xl bg-gradient-to-b from-indigo-400 to-indigo-600" />
            <div className="h-28 w-24 rounded-[40px] rounded-b-xl bg-gradient-to-b from-amber-300 to-amber-500" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PartnerHero
