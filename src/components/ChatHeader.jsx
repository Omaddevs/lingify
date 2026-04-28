import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Info, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react'

function ChatHeader() {
  const [calling, setCalling] = useState(false)
  const [muted, setMuted] = useState(false)
  const [videoOff, setVideoOff] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  const startCall = () => {
    setCalling(true)
    setCallDuration(0)
    const timer = setInterval(() => {
      setCallDuration((s) => s + 1)
    }, 1000)
    // store interval id in closure — cleared on endCall
    window._callTimer = timer
  }

  const endCall = () => {
    setCalling(false)
    clearInterval(window._callTimer)
    setMuted(false)
    setVideoOff(false)
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  return (
    <>
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/80?img=47"
              alt="Emma Johnson"
              className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Emma Johnson</p>
            <p className="text-xs font-medium text-emerald-500">Online now</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.08, backgroundColor: '#ede9fe' }}
            whileTap={{ scale: 0.93 }}
            onClick={startCall}
            className="grid h-9 w-9 place-items-center rounded-full text-indigo-500 transition"
            title="Start voice call"
          >
            <Phone size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08, backgroundColor: '#f1f5f9' }}
            whileTap={{ scale: 0.93 }}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition"
            title="Info"
          >
            <Info size={18} />
          </motion.button>
        </div>
      </div>

      {/* Call overlay */}
      <AnimatePresence>
        {calling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="flex w-80 flex-col items-center gap-6 rounded-[28px] bg-gradient-to-br from-indigo-600 to-violet-700 px-8 py-10 shadow-2xl"
            >
              {/* Avatar pulse ring */}
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-white/20" />
                <img
                  src="https://i.pravatar.cc/80?img=47"
                  alt="Emma Johnson"
                  className="relative h-24 w-24 rounded-full border-4 border-white/30 object-cover shadow-xl"
                />
              </div>

              <div className="text-center">
                <p className="text-xl font-bold text-white">Emma Johnson</p>
                <p className="mt-1 text-sm font-medium text-indigo-200">
                  {formatTime(callDuration)}
                </p>
              </div>

              {/* Call controls */}
              <div className="flex items-center gap-5">
                {/* Mute */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMuted((m) => !m)}
                  className={`grid h-12 w-12 place-items-center rounded-full transition ${
                    muted ? 'bg-white text-indigo-600' : 'bg-white/20 text-white'
                  }`}
                >
                  {muted ? <MicOff size={20} /> : <Mic size={20} />}
                </motion.button>

                {/* End call */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={endCall}
                  className="grid h-16 w-16 place-items-center rounded-full bg-red-500 text-white shadow-lg"
                >
                  <PhoneOff size={24} />
                </motion.button>

                {/* Video toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setVideoOff((v) => !v)}
                  className={`grid h-12 w-12 place-items-center rounded-full transition ${
                    videoOff ? 'bg-white text-indigo-600' : 'bg-white/20 text-white'
                  }`}
                >
                  {videoOff ? <VideoOff size={20} /> : <Video size={20} />}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatHeader
