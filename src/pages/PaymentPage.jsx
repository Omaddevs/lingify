import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, CheckCircle2, ChevronRight, Clock,
  Crown, Lock, Shield, Sparkles, Zap,
} from 'lucide-react'
import { useUser } from '../context/UserContext'

// ── Plan data ─────────────────────────────────────────────────────────────────
const PLANS = {
  monthly: {
    id: 'monthly', label: 'Oylik', price: 49000, priceUSD: '$4',
    period: '/oy', badge: null, savings: null,
    billedAs: '49 000 UZS har oyda',
  },
  yearly: {
    id: 'yearly', label: 'Yillik', price: 399000, priceUSD: '$32',
    period: '/yil', badge: '32% tejash 🔥', savings: '189 000 UZS tejaysiz',
    billedAs: '399 000 UZS yiliga (33 250/oy)',
  },
}

const PREMIUM_FEATURES = [
  { icon: '∞',  text: 'Cheksiz darslar va mock testlar' },
  { icon: '🤖', text: 'AI Writing & Speaking feedback' },
  { icon: '📜', text: 'Rasmiy sertifikatlar (4 xil)' },
  { icon: '📥', text: 'PDF natijalar yuklab olish' },
  { icon: '⚡', text: 'Priority partner matching' },
  { icon: '🎓', text: 'Teacher kurslarida 10% chegirma' },
  { icon: '📊', text: 'Kengaytirilgan analytics' },
  { icon: '🔔', text: 'Push bildirishnomalar' },
]

const PAYMENT_METHODS = [
  { id: 'payme',    name: 'Payme',    logo: '💳', color: 'from-blue-500 to-blue-600',    desc: 'Uzcard, Humo, Visa, Mastercard' },
  { id: 'click',    name: 'Click',    logo: '🟢', color: 'from-green-500 to-green-600',   desc: 'Barcha Uzcard va Humo kartalar' },
  { id: 'uzum',     name: 'Uzum Pay', logo: '🟣', color: 'from-purple-500 to-purple-600', desc: 'Uzum Bank kartasi' },
  { id: 'transfer', name: 'Bank o\'tkazma', logo: '🏦', color: 'from-slate-500 to-slate-600', desc: 'Hisobga to\'g\'ridan to\'g\'ri' },
]

// ─────────────────────────────────────────────────────────────────────────────
function PaymentPage() {
  const navigate       = useNavigate()
  const [params]       = useSearchParams()
  const { user }       = useUser()

  const defaultPlan = params.get('plan') || 'yearly'
  const [selectedPlan,   setPlan]       = useState(defaultPlan)
  const [selectedMethod, setMethod]     = useState('payme')
  const [step,           setStep]       = useState(1) // 1=plan, 2=method, 3=confirm, 4=success
  const [processing,     setProcessing] = useState(false)

  const plan = PLANS[selectedPlan] || PLANS.yearly

  function handlePay() {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setStep(4)
    }, 2200)
  }

  // ── Step 4: Success ──────────────────────────────────────────────────────
  if (step === 4) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 250 }}
          className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl">
          <CheckCircle2 size={48} className="text-white" />
        </motion.div>
        <h2 className="text-2xl font-black text-slate-900">To'lov muvaffaqiyatli! 🎉</h2>
        <p className="mt-2 text-slate-500">
          Premium a'zolik faollashtirildi. Barcha imkoniyatlar endi ochiq!
        </p>

        <div className="mt-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-4">
          <Crown size={20} className="mx-auto mb-2 text-amber-500" />
          <p className="text-sm font-bold text-amber-900">{plan.label} Premium</p>
          <p className="text-xs text-amber-600">{plan.billedAs}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/certificate')}
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            📜 Sertifikat
          </button>
          <button onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-bold text-white shadow-md">
            <Sparkles size={15} />Boshlash
          </button>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button onClick={() => step > 1 ? setStep(s => s-1) : navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 shrink-0">
            <ArrowLeft size={15} />
          </button>
          <div className="flex-1">
            <p className="text-sm font-black text-slate-900">Premium obuna</p>
            <p className="text-[11px] text-slate-400">Qadam {step}/3</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
            <Shield size={11} />Xavfsiz to'lov
          </div>
        </div>
        {/* Step indicator */}
        <div className="mx-auto mt-2 max-w-3xl flex gap-1.5">
          {[1,2,3].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6">
        <AnimatePresence mode="wait">

          {/* ── Step 1: Plan selection ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}
              className="space-y-5">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Reja tanlang</h1>
                <p className="mt-1 text-sm text-slate-500">Istalgan vaqt bekor qilishingiz mumkin</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {Object.values(PLANS).map((p) => (
                  <motion.button key={p.id} whileHover={{ y:-3 }} onClick={() => setPlan(p.id)}
                    className={`relative rounded-3xl border-2 p-5 text-left transition-all ${
                      selectedPlan === p.id
                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-violet-50 shadow-lg shadow-indigo-100'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}>
                    {p.badge && (
                      <span className="absolute -top-3 left-4 rounded-full bg-gradient-to-r from-orange-400 to-red-500 px-3 py-0.5 text-[11px] font-black text-white shadow">
                        {p.badge}
                      </span>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{p.label}</p>
                        <div className="flex items-end gap-1 mt-1">
                          <p className="text-3xl font-black text-slate-900">{p.price.toLocaleString()}</p>
                          <p className="mb-1 text-sm text-slate-400">UZS{p.period}</p>
                        </div>
                        <p className="text-[11px] text-indigo-500 font-semibold">≈ {p.priceUSD}</p>
                      </div>
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                        selectedPlan === p.id ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                      }`}>
                        {selectedPlan === p.id && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                    </div>
                    {p.savings && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        <Zap size={9} />{p.savings}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Features */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="mb-4 text-sm font-black text-slate-700 flex items-center gap-2">
                  <Crown size={16} className="text-amber-500" />Premium imkoniyatlari
                </p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {PREMIUM_FEATURES.map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <span className="text-base shrink-0">{icon}</span>
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep(2)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 py-4 text-sm font-black text-white shadow-xl hover:shadow-2xl transition">
                Davom etish <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

          {/* ── Step 2: Payment method ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}
              className="space-y-5">
              <div>
                <h1 className="text-2xl font-black text-slate-900">To'lov usuli</h1>
                <p className="mt-1 text-sm text-slate-500">Qulay to'lov tizimini tanlang</p>
              </div>

              {/* Order summary */}
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-indigo-500 font-semibold">Tanlangan reja</p>
                    <p className="font-black text-indigo-900">{plan.label} Premium</p>
                  </div>
                  <p className="text-xl font-black text-indigo-900">{plan.price.toLocaleString()} UZS</p>
                </div>
              </div>

              <div className="space-y-3">
                {PAYMENT_METHODS.map((m) => (
                  <motion.button key={m.id} whileHover={{ x: 3 }} onClick={() => setMethod(m.id)}
                    className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${
                      selectedMethod === m.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}>
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${m.color} text-2xl shadow-sm`}>
                      {m.logo}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{m.name}</p>
                      <p className="text-xs text-slate-400">{m.desc}</p>
                    </div>
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                      selectedMethod === m.id ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                    }`}>
                      {selectedMethod === m.id && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Security note */}
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-500">
                <Lock size={13} className="text-slate-400 shrink-0" />
                <span>Barcha to'lovlar 256-bit SSL bilan himoyalangan. Karta ma'lumotlari saqlanmaydi.</span>
              </div>

              <button onClick={() => setStep(3)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 py-4 text-sm font-black text-white shadow-xl hover:shadow-2xl transition">
                To'lov ma'lumotlari <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

          {/* ── Step 3: Confirm ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}
              className="space-y-5">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Tasdiqlash</h1>
                <p className="mt-1 text-sm text-slate-500">To'lovni tasdiqlashdan oldin tekshiring</p>
              </div>

              {/* Summary card */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-gradient-to-r from-indigo-600 to-violet-700 px-5 py-4">
                  <p className="text-xs text-indigo-200">Obuna</p>
                  <p className="text-lg font-black text-white">Lingify {plan.label} Premium</p>
                </div>
                <div className="divide-y divide-slate-100 px-5">
                  {[
                    { label: 'Reja',          value: `${plan.label} Premium` },
                    { label: 'To\'lov',       value: `${plan.price.toLocaleString()} UZS` },
                    { label: 'To\'lov usuli', value: PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name },
                    { label: 'Hisoblanadi',   value: plan.billedAs },
                    { label: 'Foydalanuvchi',  value: user?.name || 'Foydalanuvchi' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-3 text-sm">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-semibold text-slate-900">{value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-3">
                    <span className="font-black text-slate-900">Jami</span>
                    <span className="text-xl font-black text-indigo-700">{plan.price.toLocaleString()} UZS</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs text-slate-400 text-center">
                "To'lash" tugmasini bosish orqali siz{' '}
                <span className="text-indigo-600 cursor-pointer hover:underline">Foydalanish shartlari</span> va{' '}
                <span className="text-indigo-600 cursor-pointer hover:underline">Maxfiylik siyosati</span>ga roziligingizni bildirasiz.
              </p>

              {/* Pay button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handlePay}
                disabled={processing}
                className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 py-4 text-base font-black text-white shadow-xl hover:shadow-2xl transition disabled:opacity-80"
              >
                {processing ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Amalga oshirilmoqda...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    {plan.price.toLocaleString()} UZS To'lash
                  </>
                )}
                {/* Shimmer effect */}
                {!processing && (
                  <span className="absolute inset-0 translate-x-[-100%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                )}
              </motion.button>

              <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Shield size={11} />SSL xavfsiz</span>
                <span className="flex items-center gap-1"><Clock size={11} />30 kun kafolat</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={11} />Bekor qilish mumkin</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default PaymentPage
