import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Image, Plus, Send, Smile, X } from 'lucide-react'

const EMOJIS = [
  '😀','😁','😂','🤣','😊','😍','🥰','😎','🤩','😜',
  '😢','😭','😡','🥳','🤔','👋','👍','👎','❤️','🔥',
  '🎉','✅','🙏','💪','🤝','😴','🫡','😅','🤗','💯',
  '👀','🫶','🥺','😬','🤯','🥴','🫠','😤','🤫','😏',
]

function ChatInput({ onSend }) {
  const [text,       setText]       = useState('')
  const [showEmoji,  setShowEmoji]  = useState(false)
  const [showAttach, setShowAttach] = useState(false)
  const [preview,    setPreview]    = useState(null)

  const inputRef  = useRef(null)
  const fileRef   = useRef(null)
  const emojiRef  = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) setShowEmoji(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSend = () => {
    if (preview) { onSend(null, preview); setPreview(null); return }
    if (!text.trim()) return
    onSend(text.trim())
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
    const url  = URL.createObjectURL(file)
    const type = file.type.startsWith('image/') ? 'image' : 'file'
    setPreview({ name: file.name, url, type })
    setShowAttach(false)
    fileRef.current.value = ''
  }

  return (
    <div className="relative border-t border-slate-100 bg-white px-4 py-3">
      {/* File preview */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            role="status"
            aria-label={`Attachment: ${preview.name}`}
            className="mb-2 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-3 py-2"
          >
            {preview.type === 'image'
              ? <img src={preview.url} alt={`Preview of ${preview.name}`} className="h-10 w-10 rounded-xl object-cover" />
              : <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-100 text-indigo-600" aria-hidden="true"><FileText size={18} /></div>}
            <span className="flex-1 truncate text-xs font-medium text-slate-700">{preview.name}</span>
            <button
              type="button"
              aria-label="Remove attachment"
              onClick={() => setPreview(null)}
              className="text-slate-400 hover:text-red-500"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attach dropdown */}
      <AnimatePresence>
        {showAttach && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            role="menu"
            aria-label="Attachment options"
            className="absolute bottom-20 left-4 z-30 flex flex-col gap-1 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl"
          >
            <button
              role="menuitem"
              onClick={() => { fileRef.current.accept = 'image/*'; fileRef.current.click() }}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600"
            >
              <Image size={16} className="text-indigo-500" aria-hidden="true" />
              Photo / Video
            </button>
            <button
              role="menuitem"
              onClick={() => { fileRef.current.accept = '*/*'; fileRef.current.click() }}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600"
            >
              <FileText size={16} className="text-indigo-500" aria-hidden="true" />
              Document
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
            role="dialog"
            aria-label="Emoji picker"
            className="absolute bottom-20 right-16 z-30 w-72 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Emojis</p>
            <div className="grid grid-cols-10 gap-1">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  aria-label={`Insert ${e}`}
                  onClick={() => insertEmoji(e)}
                  className="rounded-lg p-1 text-xl transition hover:bg-indigo-50 hover:scale-125"
                >
                  {e}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input ref={fileRef} type="file" className="hidden" aria-hidden="true" onChange={handleFile} />

      <div className="flex items-center gap-3">
        <motion.button
          type="button"
          aria-label={showAttach ? 'Close attachment menu' : 'Add attachment'}
          aria-expanded={showAttach}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setShowAttach((v) => !v); setShowEmoji(false) }}
          className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-full shadow-md transition ${
            showAttach ? 'bg-indigo-700 text-white' : 'bg-indigo-600 text-white shadow-indigo-200'
          }`}
        >
          <Plus size={20} aria-hidden="true" className={`transition-transform duration-200 ${showAttach ? 'rotate-45' : ''}`} />
        </motion.button>

        <div className="relative flex flex-1 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition-all focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]">
          <label htmlFor="chat-input" className="sr-only">
            {preview ? 'Add a caption' : 'Type a message'}
          </label>
          <input
            id="chat-input"
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={preview ? 'Add a caption…' : 'Type a message…'}
            aria-label={preview ? 'Caption for attachment' : 'Message'}
            className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
          <motion.button
            type="button"
            aria-label={showEmoji ? 'Close emoji picker' : 'Open emoji picker'}
            aria-expanded={showEmoji}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { setShowEmoji((v) => !v); setShowAttach(false) }}
            className={`ml-2 transition ${showEmoji ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-500'}`}
          >
            <Smile size={20} aria-hidden="true" />
          </motion.button>
        </div>

        <motion.button
          type="button"
          aria-label="Send message"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!text.trim() && !preview}
          className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-indigo-600 text-white shadow-md shadow-indigo-200 transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={17} aria-hidden="true" />
        </motion.button>
      </div>
    </div>
  )
}

export default ChatInput
