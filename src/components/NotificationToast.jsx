import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Flame, Info, X, Zap } from 'lucide-react'

const TYPE_STYLES = {
  xp:      { bg: 'bg-indigo-700', icon: Zap,          iconColor: 'text-yellow-300' },
  success: { bg: 'bg-emerald-700', icon: CheckCircle2, iconColor: 'text-white' },
  streak:  { bg: 'bg-orange-600', icon: Flame,         iconColor: 'text-white' },
  info:    { bg: 'bg-slate-800',  icon: Info,          iconColor: 'text-blue-300' },
}

export function NotificationToast({ notifications, onDismiss }) {
  return (
    <div className="fixed bottom-24 right-4 z-[200] flex flex-col gap-2 xl:bottom-6">
      <AnimatePresence>
        {notifications.map(({ id, msg, type }) => {
          const { bg, icon: Icon, iconColor } = TYPE_STYLES[type] || TYPE_STYLES.info
          return (
            <motion.div key={id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white shadow-xl ${bg}`}>
              <Icon size={16} className={`shrink-0 ${iconColor}`} />
              <span>{msg}</span>
              {onDismiss && (
                <button onClick={() => onDismiss(id)} className="ml-1 shrink-0 opacity-60 hover:opacity-100">
                  <X size={13} />
                </button>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
