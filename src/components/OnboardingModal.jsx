import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, BookOpen, CheckCircle2, Clock, Mic, Target, Trophy, Users } from 'lucide-react'
import { PLACEMENT_TEST, calculateLevel } from '../data/curriculum'

const GOALS        = ['IELTS', 'TOEFL', 'SAT', 'Speaking', 'General English']
const TIMES        = ['10 daqiqa', '20 daqiqa', '30+ daqiqa']
const PREFERENCES  = ['AI Practice', 'Real Partner', 'Ikkalasi ham']
const TOTAL_STEPS  = 6

// Mini placement test (5 questions only for onboarding)
const MINI_TEST = PLACEMENT_TEST.slice(0, 5)

function ProgressBar({ step, total }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="text-xs font-bold text-slate-400">Qadam {step + 1}/{total}</span>
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700"
          animate={{ width: `${((step + 1) / total) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  )
}

function OnboardingModal({ userName, onFinish }) {
  const [step,          setStep]     = useState(0)
  const [level,         setLevel]    = useState(null)
  const [selectedGoals, setGoals]    = useState(['IELTS'])
  const [dailyTime,     setTime]     = useState('20 daqiqa')
  const [preference,    setPref]     = useState('Ikkalasi ham')
  const [quizAnswers,   setAnswers]  = useState({})
  const [quizDone,      setQuizDone] = useState(false)

  function toggleGoal(g) {
    setGoals((p) => p.includes(g) ? p.filter((x) => x !== g) : [...p, g])
  }

  function answerQuiz(qId, idx) {
    setAnswers((p) => ({ ...p, [qId]: idx }))
  }

  function finishQuiz() {
    const answerArray = MINI_TEST.map((q) => quizAnswers[q.id] ?? -1)
    const detectedLevel = calculateLevel(answerArray, MINI_TEST)
    setLevel(detectedLevel)
    setQuizDone(true)
  }

  function submit() {
    onFinish({
      level:             level || 'B1',
      goals:             selectedGoals,
      dailyTime,
      learningPreference: preference,
    })
  }

  const FEATURE_CARDS = [
    { icon: BookOpen,  color: 'bg-indigo-100 text-indigo-600', title: 'A0 dan C1',      desc: 'O\'zbek tilida 15+ dars' },
    { icon: Mic,       color: 'bg-violet-100 text-violet-600', title: 'AI Speaking',     desc: '24/7 gapirish mashqi' },
    { icon: Trophy,    color: 'bg-amber-100 text-amber-600',   title: 'Mock Testlar',    desc: 'Cambridge IELTS 11 audio' },
    { icon: Users,     color: 'bg-emerald-100 text-emerald-600',title:'Real Partnerlar', desc: 'Speaking sessiyalar' },
  ]

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/70 bg-white p-6 shadow-2xl md:p-8"
      >
        <ProgressBar step={step} total={TOTAL_STEPS} />

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}  transition={{ duration: 0.22 }}
            className="min-h-[340px] flex flex-col"
          >

            {/* ── Step 0: Welcome ── */}
            {step === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
                  className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-700 shadow-xl text-4xl">
                  🎓
                </motion.div>
                <h2 className="text-3xl font-black text-slate-900">
                  Xush kelibsiz, {userName || 'o\'rganuvchi'}!
                </h2>
                <p className="mt-2 text-slate-500 max-w-sm">
                  Lingify'ni 1 daqiqada sozlaymiz — siz uchun shaxsiy o'rganish rejasini tayyorlaymiz.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-sm">
                  {FEATURE_CARDS.map(({ icon: Icon, color, title, desc }) => (
                    <div key={title} className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-left">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{title}</p>
                        <p className="text-[10px] text-slate-400">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 1: Goals ── */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-black text-slate-900">Maqsadingiz nima?</h2>
                <p className="mt-1 text-slate-500">Bir yoki bir nechta tanlang</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {GOALS.map((g) => {
                    const icons = { 'IELTS':'📋','TOEFL':'🏫','SAT':'📐','Speaking':'🎤','General English':'📚' }
                    return (
                      <button key={g} onClick={() => toggleGoal(g)}
                        className={`flex items-center gap-2.5 rounded-2xl border-2 p-3.5 text-left transition ${
                          selectedGoals.includes(g)
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}>
                        <span className="text-xl">{icons[g]}</span>
                        <div>
                          <p className={`text-sm font-bold ${selectedGoals.includes(g) ? 'text-indigo-700' : 'text-slate-700'}`}>{g}</p>
                        </div>
                        {selectedGoals.includes(g) && (
                          <CheckCircle2 size={16} className="ml-auto text-indigo-500 shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Step 2: Daily time ── */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-black text-slate-900">Har kuni qancha vaqt?</h2>
                <p className="mt-1 text-slate-500">Haqiqatchilik bilan tanlang</p>
                <div className="mt-5 space-y-3">
                  {[
                    { time: '10 daqiqa', desc: 'Ish-darasi bilan band bo\'lgan, boshlang\'ich', icon: '⚡' },
                    { time: '20 daqiqa', desc: 'Muntazam o\'rganishga tayyor, standart', icon: '🎯' },
                    { time: '30+ daqiqa', desc: 'Tez yaxshilanmoqchi, intensiv', icon: '🚀' },
                  ].map(({ time, desc, icon }) => (
                    <button key={time} onClick={() => setTime(time)}
                      className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${
                        dailyTime === time ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
                      }`}>
                      <span className="text-2xl shrink-0">{icon}</span>
                      <div className="flex-1">
                        <p className={`font-bold ${dailyTime === time ? 'text-indigo-700' : 'text-slate-800'}`}>{time}</p>
                        <p className="text-xs text-slate-400">{desc}</p>
                      </div>
                      {dailyTime === time && <CheckCircle2 size={18} className="text-indigo-500 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 3: Preference ── */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-black text-slate-900">Qanday o'rganishni yoqtirasiz?</h2>
                <p className="mt-1 text-slate-500">O'rganish uslubingizni tanlang</p>
                <div className="mt-5 space-y-3">
                  {[
                    { pref: 'AI Practice',    desc: 'AI bilan har vaqt, har yerda mashq', icon: '🤖' },
                    { pref: 'Real Partner',   desc: 'Haqiqiy odamlar bilan suhbat',        icon: '👥' },
                    { pref: 'Ikkalasi ham',   desc: 'AI va real partnerlarni birlashtirib', icon: '⚡' },
                  ].map(({ pref, desc, icon }) => (
                    <button key={pref} onClick={() => setPref(pref)}
                      className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${
                        preference === pref ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
                      }`}>
                      <span className="text-2xl shrink-0">{icon}</span>
                      <div className="flex-1">
                        <p className={`font-bold ${preference === pref ? 'text-indigo-700' : 'text-slate-800'}`}>{pref}</p>
                        <p className="text-xs text-slate-400">{desc}</p>
                      </div>
                      {preference === pref && <CheckCircle2 size={18} className="text-indigo-500 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 4: Mini placement test ── */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-black text-slate-900">Daraja sinovi</h2>
                <p className="mt-1 text-slate-500">5 ta savol — darajangizni aniqlaymiz</p>
                <div className="mt-4 space-y-4 max-h-64 overflow-y-auto pr-1">
                  {MINI_TEST.map((q, i) => (
                    <div key={q.id} className={`rounded-2xl border-2 p-4 transition ${quizAnswers[q.id] !== undefined ? 'border-indigo-200 bg-indigo-50/40' : 'border-slate-100 bg-white'}`}>
                      <p className="text-xs font-bold text-slate-400 mb-2">Savol {i+1}</p>
                      <p className="text-sm font-semibold text-slate-900 mb-3">{q.question}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, oi) => (
                          <button key={oi} onClick={() => answerQuiz(q.id, oi)}
                            className={`rounded-xl border-2 py-2 text-xs font-semibold transition ${
                              quizAnswers[q.id] === oi ? 'border-indigo-500 bg-indigo-50 text-indigo-800' : 'border-slate-200 text-slate-700 hover:border-indigo-200'
                            }`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-slate-400">
                  {Object.keys(quizAnswers).length}/{MINI_TEST.length} ta savolga javob berildi
                </div>
              </div>
            )}

            {/* ── Step 5: Result + Ready ── */}
            {step === 5 && (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
                  className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl">
                  <Trophy size={44} className="text-white" />
                </motion.div>
                <h2 className="text-3xl font-black text-slate-900">Tayyor! 🎉</h2>
                {level && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2">
                    <Target size={16} className="text-indigo-600" />
                    <span className="font-black text-indigo-800">Darajangiz: {level}</span>
                  </div>
                )}
                <p className="mt-3 text-slate-500 max-w-sm">
                  Shaxsiy reja tayyor. Hoziroq o'rganishni boshlaymiz!
                </p>
                <div className="mt-5 grid grid-cols-3 gap-3 w-full max-w-xs text-center text-xs">
                  {[
                    { icon: '📖', label: 'Darslar', val: '15+' },
                    { icon: '📚', label: 'So\'zlar', val: '500+' },
                    { icon: '🎮', label: 'O\'yinlar', val: '15+' },
                  ].map(({ icon, label, val }) => (
                    <div key={label} className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                      <p className="text-xl">{icon}</p>
                      <p className="font-black text-slate-900">{val}</p>
                      <p className="text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* ── Action buttons ── */}
        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              Orqaga
            </button>
          )}

          {step === 4 ? (
            <button
              onClick={() => { finishQuiz(); setStep(5) }}
              disabled={Object.keys(quizAnswers).length < MINI_TEST.length}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 py-3 text-sm font-black text-white disabled:opacity-40 shadow-md transition"
            >
              Natijani ko'rish <ArrowRight size={16} />
            </button>
          ) : step === 5 ? (
            <button onClick={submit}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-black text-white shadow-md transition hover:shadow-lg">
              O'rganishni boshlash! 🚀
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 && selectedGoals.length === 0}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 py-3 text-sm font-black text-white disabled:opacity-40 shadow-md transition hover:shadow-lg"
            >
              {step === 3 ? 'Daraja sinovi' : 'Davom etish'}
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default OnboardingModal
