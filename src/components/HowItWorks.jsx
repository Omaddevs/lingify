import { motion } from 'framer-motion'
import { Handshake, MessageCircle, Rocket } from 'lucide-react'

const steps = [
  {
    id: 1,
    title: 'Find a partner',
    text: 'We match you with a partner at your level.',
    icon: Handshake,
  },
  {
    id: 2,
    title: 'Start conversation',
    text: 'Start chatting and practice together.',
    icon: MessageCircle,
  },
  {
    id: 3,
    title: 'Practice & improve',
    text: 'Improve your English skills every day.',
    icon: Rocket,
  },
]

function HowItWorks() {
  return (
    <section>
      <h3 className="mb-3 text-xl font-semibold text-slate-900">How it works?</h3>
      <div className="grid gap-3 md:grid-cols-3">
        {steps.map(({ id, title, text, icon: Icon }) => (
          <motion.article
            key={id}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {id}
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-100 text-indigo-600">
                <Icon size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
                <p className="mt-1 text-xs text-slate-500">{text}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks
