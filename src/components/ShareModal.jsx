import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Copy, Link, MessageCircle, Share2, X } from 'lucide-react'

const SHARE_TARGETS = [
  {
    id: 'telegram',
    label: 'Telegram',
    emoji: '✈️',
    color: 'bg-blue-500',
    action: (text, url) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    id: 'twitter',
    label: 'Twitter / X',
    emoji: '🐦',
    color: 'bg-slate-900',
    action: (text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    emoji: '💬',
    color: 'bg-green-500',
    action: (text, url) => `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    emoji: '📘',
    color: 'bg-blue-600',
    action: (_, url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
]

export function ShareModal({ isOpen, onClose, title, text, url }) {
  const [copied, setCopied] = useState(false)

  const shareUrl  = url || window.location.href
  const shareText = text || `Men Lingify da ingliz tilini o'rganmoqdaman! 🎓`

  function copyLink() {
    navigator.clipboard?.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function openTarget(target) {
    const href = target.action(shareText, shareUrl)
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: title || 'Lingify', text: shareText, url: shareUrl })
      } catch (_) {}
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <Share2 size={18} className="text-indigo-600" />
              <h3 className="font-black text-slate-900">{title || 'Ulashish'}</h3>
            </div>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition">
              <X size={16} />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Share text preview */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
              <p className="text-sm text-slate-600 leading-5">{shareText}</p>
              <p className="mt-1 text-[11px] text-slate-400 truncate">{shareUrl}</p>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-4 gap-2">
              {SHARE_TARGETS.map((t) => (
                <button key={t.id} onClick={() => openTarget(t)}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-slate-100 bg-white p-3 hover:bg-slate-50 transition shadow-sm">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.color} text-xl text-white shadow-sm`}>
                    {t.emoji}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Copy link */}
            <button onClick={copyLink}
              className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition ${
                copied ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
              }`}>
              {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} className="text-slate-400" />}
              {copied ? 'Nusxalandi!' : 'Havolani nusxalash'}
              <span className="ml-auto text-[11px] text-slate-300 truncate">{shareUrl.slice(0, 28)}...</span>
            </button>

            {/* Native share (mobile) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button onClick={nativeShare}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition">
                <MessageCircle size={15} />Boshqa ilovada ulashish
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ── useShare hook ─────────────────────────────────────────────────────────────
import { useState as useHookState } from 'react'

export function useShare() {
  const [isOpen, setOpen] = useHookState(false)
  const [shareData, setData] = useHookState({ title:'', text:'', url:'' })

  const share = (data) => { setData(data); setOpen(true) }
  const close  = () => setOpen(false)

  return { isOpen, shareData, share, close }
}

export default ShareModal
