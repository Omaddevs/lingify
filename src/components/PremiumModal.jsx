import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2,
  Crown,
  Infinity,
  Lock,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'

const PLANS = [
  {
    id: 'monthly',
    label: 'Oylik',
    price: '49 000',
    currency: 'UZS',
    period: '/oy',
    priceUSD: '$4',
    badge: null,
  },
  {
    id: 'yearly',
    label: 'Yillik',
    price: '399 000',
    currency: 'UZS',
    period: '/yil',
    priceUSD: '$32',
    badge: '🔥 32% tejash',
    perMonth: '33 250 UZS/oy',
  },
]

const FREE_FEATURES = [
  '3 ta dars / kun',
  '1 ta mock test / oy',
  '50 ta so\'z lug\'ati',
  'Partner topish (cheklangan)',
  'Asosiy progress statistika',
]

const PREMIUM_FEATURES = [
  'Cheksiz darslar',
  'Cheksiz mock testlar',
  'Cheksiz vocabulary',
  'AI Speaking feedback',
  'Writing Task baholash',
  'Speaking sessiyalarni saqlash',
  'PDF natijalar yuklab olish',
  'Sertifikat yaratish',
  'Priority partner matching',
  'Teacher kurslarida 10% chegirma',
]

export function PremiumModal({ isOpen, onClose, featureName = '' }) {
  const [selectedPlan, setSelectedPlan] = useState('yearly')
  const [step, setStep] = useState('plans') // plans | payment | success

  if (!isOpen) return null

  function handleBuy() {
    setStep('payment')
  }

  function handlePaymentConfirm() {
    setStep('success')
    setTimeout(() => { onClose(); setStep('plans') }, 2000)
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-100"
          >
            <X size={15} />
          </button>

          {step === 'plans' && (
            <div>
              {/* Header */}
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 px-6 pb-6 pt-6 text-white text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                  <Crown size={28} className="text-yellow-300" />
                </div>
                <h2 className="text-2xl font-bold">Lingify Premium</h2>
                {featureName && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                    <Lock size={11} />
                    "{featureName}" uchun Premium kerak
                  </div>
                )}
                <p className="mt-2 text-sm text-indigo-200">
                  Barcha imkoniyatlarni oching va tezroq o'rganing
                </p>
              </div>

              <div className="p-6">
                {/* Plan selector */}
                <div className="mb-5 grid grid-cols-2 gap-3">
                  {PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative rounded-2xl border-2 p-4 text-left transition-all ${
                        selectedPlan === plan.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {plan.badge && (
                        <span className="absolute -top-2.5 left-3 rounded-full bg-gradient-to-r from-orange-400 to-red-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                          {plan.badge}
                        </span>
                      )}
                      <p className="text-xs font-semibold text-slate-500">{plan.label}</p>
                      <p className="mt-1 text-xl font-black text-slate-900">
                        {plan.price}
                        <span className="text-sm font-normal text-slate-400"> {plan.currency}</span>
                      </p>
                      <p className="text-xs text-slate-400">{plan.period}</p>
                      {plan.perMonth && (
                        <p className="mt-1 text-[11px] text-indigo-600 font-medium">{plan.perMonth}</p>
                      )}
                      {selectedPlan === plan.id && (
                        <CheckCircle2 size={16} className="absolute right-3 top-3 text-indigo-500" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Feature comparison */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="mb-2 text-xs font-bold text-slate-500 uppercase">Bepul</p>
                    <div className="space-y-1.5">
                      {FREE_FEATURES.map((f) => (
                        <div key={f} className="flex items-start gap-1.5 text-xs text-slate-500">
                          <span className="mt-0.5 text-slate-300">•</span>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 p-3">
                    <p className="mb-2 flex items-center gap-1 text-xs font-bold text-indigo-700 uppercase">
                      <Crown size={10} className="text-yellow-500" />
                      Premium
                    </p>
                    <div className="space-y-1.5">
                      {PREMIUM_FEATURES.slice(0, 7).map((f) => (
                        <div key={f} className="flex items-start gap-1.5 text-xs text-indigo-700">
                          <CheckCircle2 size={11} className="mt-0.5 shrink-0 text-indigo-500" />
                          {f}
                        </div>
                      ))}
                      <p className="text-[10px] text-indigo-400">+ yana {PREMIUM_FEATURES.length - 7} ta...</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuy}
                  className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles size={16} />
                    Premium olish — {PLANS.find((p) => p.id === selectedPlan)?.price} UZS
                  </span>
                </motion.button>
                <p className="mt-2 text-center text-[11px] text-slate-400">
                  Payme / Click / Humo / Uzcard orqali to'lash
                </p>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
                <Zap size={28} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">To'lov usulini tanlang</h3>
              <div className="mt-5 grid gap-3">
                {[
                  { name: 'Payme', color: 'bg-blue-500', emoji: '💳' },
                  { name: 'Click', color: 'bg-emerald-500', emoji: '🟢' },
                  { name: 'Humo', color: 'bg-amber-500', emoji: '🟡' },
                  { name: 'Uzcard', color: 'bg-indigo-500', emoji: '🔵' },
                ].map((method) => (
                  <button
                    key={method.name}
                    onClick={handlePaymentConfirm}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-left hover:bg-slate-50 transition"
                  >
                    <span className="text-2xl">{method.emoji}</span>
                    <span className="font-semibold text-slate-800">{method.name}</span>
                    <span className="ml-auto text-xs text-slate-400">Demo mode</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep('plans')}
                className="mt-4 text-sm text-slate-400 hover:underline"
              >
                ← Orqaga
              </button>
            </div>
          )}

          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"
              >
                <CheckCircle2 size={40} className="text-emerald-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-900">Tabriklaymiz! 🎉</h3>
              <p className="mt-2 text-slate-500">
                Premium a'zolik faollashtirildi. Barcha imkoniyatlar ochiq!
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ── usePremium hook ──────────────────────────────────────────────────────────
import { useCallback, useState as useHookState } from 'react'

export function usePremium() {
  const [isOpen, setIsOpen] = useHookState(false)
  const [featureName, setFeatureName] = useHookState('')

  const openPremium = useCallback((name = '') => {
    setFeatureName(name)
    setIsOpen(true)
  }, [])

  const closePremium = useCallback(() => setIsOpen(false), [])

  return { isOpen, featureName, openPremium, closePremium }
}

export default PremiumModal
