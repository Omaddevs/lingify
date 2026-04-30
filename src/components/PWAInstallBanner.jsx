import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Share2, X } from 'lucide-react'
import { usePWAInstall } from '../hooks/usePWAInstall'

export function PWAInstallBanner() {
  const { canInstall, install, installed, isIOS } = usePWAInstall()
  const [dismissed, setDismiss] = useState(
    () => sessionStorage.getItem('pwa_banner_dismissed') === 'true'
  )

  if (!canInstall || installed || dismissed) return null

  function dismiss() {
    sessionStorage.setItem('pwa_banner_dismissed', 'true')
    setDismiss(true)
  }

  async function handleInstall() {
    if (isIOS) return // Show instructions instead
    const ok = await install()
    if (ok) setDismiss(true)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="fixed bottom-20 left-4 right-4 z-40 xl:bottom-6 xl:left-auto xl:right-6 xl:w-96"
      >
        <div className="overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-2xl shadow-indigo-100">
          {/* Color strip */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-violet-600" />

          <div className="flex items-start gap-3 p-4">
            {/* App icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md text-2xl">
              🎓
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-black text-slate-900">Lingify'ni o'rnating</p>
              {isIOS ? (
                <p className="text-xs text-slate-500 mt-0.5 leading-5">
                  Safari'da <Share2 size={11} className="inline" /> bosing, keyin
                  "Bosh ekranga qo'shish" ni tanlang
                </p>
              ) : (
                <p className="text-xs text-slate-500 mt-0.5">
                  Telefon va kompyuterga o'rnating — internet bo'lmasa ham ishlaydi
                </p>
              )}

              {!isIOS && (
                <button
                  onClick={handleInstall}
                  className="mt-2.5 flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
                >
                  <Download size={12} />O'rnatish
                </button>
              )}
            </div>

            <button
              onClick={dismiss}
              className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 transition"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PWAInstallBanner
