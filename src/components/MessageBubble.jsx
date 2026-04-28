import { motion } from 'framer-motion'
import { CheckCheck, FileText } from 'lucide-react'

function MessageBubble({ message, isSent }) {
  const { text, file, time } = message

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`group max-w-[70%] rounded-[18px] shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden ${
          isSent
            ? 'bg-indigo-600 text-white rounded-br-[4px]'
            : 'bg-white text-slate-800 rounded-bl-[4px] border border-slate-100'
        }`}
      >
        {/* Image attachment */}
        {file?.type === 'image' && (
          <img
            src={file.url}
            alt="sent"
            className="max-h-60 w-full object-cover"
          />
        )}

        {/* File attachment */}
        {file?.type === 'file' && (
          <div className={`flex items-center gap-2 px-4 pt-3 pb-1 ${isSent ? 'text-indigo-100' : 'text-slate-600'}`}>
            <div className={`grid h-9 w-9 place-items-center rounded-xl ${isSent ? 'bg-white/20' : 'bg-indigo-50 text-indigo-500'}`}>
              <FileText size={16} />
            </div>
            <span className="text-xs font-medium truncate max-w-[160px]">{file.name}</span>
          </div>
        )}

        {/* Text */}
        {text && (
          <p className={`px-4 text-sm leading-relaxed ${file ? 'pt-1 pb-0' : 'pt-2.5 pb-0'}`}>{text}</p>
        )}

        {/* Timestamp + check */}
        <div className={`flex items-center gap-1 pb-2 px-4 pt-1 ${isSent ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-[10px] ${isSent ? 'text-indigo-200' : 'text-slate-400'}`}>{time}</span>
          {isSent && <CheckCheck size={12} className="text-indigo-200" />}
        </div>
      </div>
    </motion.div>
  )
}

export default MessageBubble
