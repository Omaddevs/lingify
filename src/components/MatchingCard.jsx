import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import Loader from './Loader'
import MatchResult from './MatchResult'

function MatchingCard({ state, onFindAnother }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <article className="rounded-[20px] border border-slate-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6 shadow-md">
        <h3 className="text-3xl font-bold tracking-tight text-slate-900">Ready to match?</h3>
        <p className="mt-2 text-sm text-slate-600">Click the button above and we&apos;ll find a partner for you.</p>

        {state === 'loading' ? (
          <Loader />
        ) : (
          <div className="relative mt-8 flex items-center justify-center py-8">
            <div className="h-40 w-40 rounded-full border-2 border-indigo-100 bg-white/70" />
            <div className="absolute grid h-24 w-24 place-items-center rounded-full bg-indigo-100 text-indigo-700">
              <Users size={24} />
              <span className="-mt-2 text-xs font-medium">{state === 'found' ? 'Matched' : 'Finding...'}</span>
            </div>
            <motion.img
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              src="https://i.pravatar.cc/40?img=11"
              alt=""
              className="absolute left-16 top-3 h-10 w-10 rounded-full border-2 border-white"
            />
            <motion.img
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, delay: 0.2 }}
              src="https://i.pravatar.cc/40?img=23"
              alt=""
              className="absolute right-16 top-3 h-10 w-10 rounded-full border-2 border-white"
            />
            <motion.img
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2.4, delay: 0.4 }}
              src="https://i.pravatar.cc/40?img=29"
              alt=""
              className="absolute bottom-4 left-24 h-10 w-10 rounded-full border-2 border-white"
            />
            <motion.img
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2.6, delay: 0.3 }}
              src="https://i.pravatar.cc/40?img=35"
              alt=""
              className="absolute bottom-5 right-24 h-10 w-10 rounded-full border-2 border-white"
            />
          </div>
        )}
      </article>

      <div>{state === 'found' ? <MatchResult onFindAnother={onFindAnother} /> : <div className="h-full rounded-[18px] border border-dashed border-slate-200 bg-white/50" />}</div>
    </section>
  )
}

export default MatchingCard
