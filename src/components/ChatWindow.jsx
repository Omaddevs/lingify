import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, PhoneOff, Mic, MicOff, Video, VideoOff,
  Info, MoreVertical, CheckCheck, Plus, Smile,
  Send, Image, FileText, X, Search, Users,
} from 'lucide-react'
import MessageBubble from './MessageBubble'

const EMOJIS = [
  '😀','😁','😂','🤣','😊','😍','🥰','😎','🤩','😜',
  '😢','😭','😡','🥳','🤔','👋','👍','👎','❤️','🔥',
  '🎉','✅','🙏','💪','🤝','😴','🫡','😅','🤗','💯',
  '👀','🫶','🥺','😬','🤯','🥴','🫠','😤','🤫','😏',
]

function ChatWindow({ conversation, onSend }) {
  const [text, setText] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [showAttach, setShowAttach] = useState(false)
  const [preview, setPreview] = useState(null)
  const [calling, setCalling] = useState(false)
  const [muted, setMuted] = useState(false)
  const [videoOff, setVideoOff] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [showInfo, setShowInfo] = useState(false)

  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const fileRef = useRef(null)
  const emojiRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.messages])

  useEffect(() => {
    setText('')
    setPreview(null)
    setShowEmoji(false)
    setShowAttach(false)
  }, [conversation.id])

  // Close emoji on outside click
  useEffect(() => {
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) setShowEmoji(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const startCall = () => {
    setCalling(true)
    setCallDuration(0)
    window._callTimer = setInterval(() => setCallDuration((s) => s + 1), 1000)
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

  const handleSend = () => {
    if (preview) {
      onSend(conversation.id, null, preview)
      setPreview(null)
      return
    }
    if (!text.trim()) return
    onSend(conversation.id, text.trim())
    setText('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const insertEmoji = (emoji) => {
    setText((t) => t + emoji)
    inputRef.current?.focus()
    setShowEmoji(false)
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const type = file.type.startsWith('image/') ? 'image' : 'file'
    setPreview({ name: file.name, url, type })
    setShowAttach(false)
    fileRef.current.value = ''
  }

  return (
    <div className="flex h-full flex-col bg-[#f8fafc]">
      {/* ── Chat Header ── */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            {conversation.group ? (
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 text-white shadow-sm">
                <Users size={18} />
              </div>
            ) : (
              <>
                <img
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
                {conversation.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                )}
              </>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{conversation.name}</p>
            <p className={`text-xs font-medium ${conversation.online ? 'text-emerald-500' : 'text-slate-400'}`}>
              {conversation.lastSeen}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.08, backgroundColor: '#ede9fe' }}
            whileTap={{ scale: 0.93 }}
            onClick={startCall}
            title="Voice call"
            className="grid h-9 w-9 place-items-center rounded-full text-indigo-500 transition"
          >
            <Phone size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08, backgroundColor: '#f1f5f9' }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setShowInfo((v) => !v)}
            title="Search"
            className={`grid h-9 w-9 place-items-center rounded-full transition ${showInfo ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}
          >
            <Search size={17} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08, backgroundColor: '#f1f5f9' }}
            whileTap={{ scale: 0.93 }}
            title="More"
            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition"
          >
            <MoreVertical size={18} />
          </motion.button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Date separator */}
        <div className="mb-4 flex items-center justify-center">
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-400 shadow-sm border border-slate-100">
            Today
          </span>
        </div>

        <div className="space-y-1">
          {conversation.messages.map((msg) => (
            <div key={msg.id}>
              {msg.sender && (
                <p className="mb-0.5 ml-1 text-[11px] font-semibold text-indigo-500">{msg.sender}</p>
              )}
              <MessageBubble message={msg} isSent={msg.isSent} />
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input Area ── */}
      <div className="relative border-t border-slate-100 bg-white px-4 py-3">
        {/* File preview */}
        <AnimatePresence>
          {preview && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mb-2 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-3 py-2"
            >
              {preview.type === 'image' ? (
                <img src={preview.url} alt="preview" className="h-10 w-10 rounded-xl object-cover" />
              ) : (
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
                  <FileText size={18} />
                </div>
              )}
              <span className="flex-1 truncate text-xs font-medium text-slate-700">{preview.name}</span>
              <button onClick={() => setPreview(null)} className="text-slate-400 hover:text-red-500">
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attach menu */}
        <AnimatePresence>
          {showAttach && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-20 left-4 z-30 flex flex-col gap-1 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl"
            >
              <button
                onClick={() => { fileRef.current.accept = 'image/*'; fileRef.current.click() }}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                <Image size={16} className="text-indigo-500" /> Photo / Video
              </button>
              <button
                onClick={() => { fileRef.current.accept = '*/*'; fileRef.current.click() }}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                <FileText size={16} className="text-indigo-500" /> Document
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emoji picker */}
        <AnimatePresence>
          {showEmoji && (
            <motion.div
              ref={emojiRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-20 right-16 z-30 w-72 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Emojis</p>
              <div className="grid grid-cols-10 gap-1">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => insertEmoji(e)}
                    className="rounded-lg p-1 text-xl transition hover:scale-125 hover:bg-indigo-50"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setShowAttach((v) => !v); setShowEmoji(false) }}
            className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-full shadow-md transition ${showAttach ? 'bg-indigo-700' : 'bg-indigo-600'} text-white shadow-indigo-200`}
          >
            <Plus size={20} className={`transition-transform duration-200 ${showAttach ? 'rotate-45' : ''}`} />
          </motion.button>

          <div className="relative flex flex-1 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition-all focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]">
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={preview ? 'Add a caption...' : 'Type a message...'}
              className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setShowEmoji((v) => !v); setShowAttach(false) }}
              className={`ml-2 transition ${showEmoji ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-500'}`}
            >
              <Smile size={20} />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!text.trim() && !preview}
            className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-indigo-600 text-white shadow-md shadow-indigo-200 transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={17} />
          </motion.button>
        </div>
      </div>

      {/* ── Call Overlay ── */}
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
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-white/20" />
                {conversation.group ? (
                  <div className="relative grid h-24 w-24 place-items-center rounded-full border-4 border-white/30 bg-indigo-400 text-white shadow-xl">
                    <Users size={40} />
                  </div>
                ) : (
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="relative h-24 w-24 rounded-full border-4 border-white/30 object-cover shadow-xl"
                  />
                )}
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">{conversation.name}</p>
                <p className="mt-1 text-sm font-medium text-indigo-200">{formatTime(callDuration)}</p>
              </div>
              <div className="flex items-center gap-5">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMuted((m) => !m)}
                  className={`grid h-12 w-12 place-items-center rounded-full transition ${muted ? 'bg-white text-indigo-600' : 'bg-white/20 text-white'}`}
                >
                  {muted ? <MicOff size={20} /> : <Mic size={20} />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={endCall}
                  className="grid h-16 w-16 place-items-center rounded-full bg-red-500 text-white shadow-lg"
                >
                  <PhoneOff size={24} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setVideoOff((v) => !v)}
                  className={`grid h-12 w-12 place-items-center rounded-full transition ${videoOff ? 'bg-white text-indigo-600' : 'bg-white/20 text-white'}`}
                >
                  {videoOff ? <VideoOff size={20} /> : <Video size={20} />}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChatWindow
