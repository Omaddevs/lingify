import { motion } from 'framer-motion'

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.article
      whileHover={{ y: -3, scale: 1.01 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-3 inline-flex rounded-xl bg-indigo-100 p-2.5 text-indigo-600">
        <Icon size={18} />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </motion.article>
  )
}

export default FeatureCard
