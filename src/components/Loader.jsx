import { motion } from 'framer-motion'
import { Users } from 'lucide-react'

function Loader() {
  return (
    <div className="relative flex items-center justify-center py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2.1, ease: 'linear' }}
        className="grid h-36 w-36 place-items-center rounded-full border-[10px] border-indigo-100 border-t-indigo-600"
      >
        <div className="grid h-24 w-24 place-items-center rounded-full bg-indigo-50 text-indigo-600">
          <Users size={26} />
        </div>
      </motion.div>
      <p className="absolute -bottom-1 text-sm font-medium text-indigo-700">Finding...</p>
    </div>
  )
}

export default Loader
