import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const goals = ['IELTS', 'TOEFL', 'Speaking', 'General English']
const times = ['10 min', '20 min', '30+ min']
const preferences = ['AI Practice', 'Real Partner', 'Mixed']

function OnboardingModal({ userName, onFinish }) {
  const [step, setStep] = useState(0)
  const [level, setLevel] = useState('B1')
  const [selectedGoals, setSelectedGoals] = useState(['IELTS'])
  const [dailyTime, setDailyTime] = useState('20 min')
  const [preference, setPreference] = useState('Mixed')

  const canContinue = useMemo(() => {
    if (step === 2) return selectedGoals.length > 0
    return true
  }, [step, selectedGoals.length])

  function toggleGoal(goal) {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    )
  }

  function next() {
    if (step < 5) setStep((s) => s + 1)
  }

  function submit() {
    onFinish({
      level,
      goals: selectedGoals,
      dailyTime,
      learningPreference: preference,
    })
  }

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="mx-auto flex h-full w-full max-w-3xl items-center justify-center">
        <div className="w-full rounded-3xl border border-white/70 bg-white p-6 shadow-2xl md:p-8">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Step {step + 1} / 6</p>
            <div className="h-2 w-44 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700 transition-all" style={{ width: `${((step + 1) / 6) * 100}%` }} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              className="min-h-[320px]"
            >
              {step === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-5 h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700" />
                  <h2 className="text-3xl font-bold text-slate-900">Welcome to Lingify, {userName || 'Learner'}!</h2>
                  <p className="mt-2 text-slate-500">Let us personalize your learning journey in less than a minute.</p>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Choose your level</h2>
                  <p className="mt-1 text-slate-500">Select your current English proficiency.</p>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {levels.map((item) => (
                      <button key={item} onClick={() => setLevel(item)} className={`rounded-xl border px-3 py-5 font-semibold ${level === item ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-700'}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">What are your goals?</h2>
                  <p className="mt-1 text-slate-500">Choose one or more goals to generate your plan.</p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {goals.map((item) => (
                      <button key={item} onClick={() => toggleGoal(item)} className={`rounded-xl border px-3 py-4 font-medium ${selectedGoals.includes(item) ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-700'}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Daily time commitment</h2>
                  <p className="mt-1 text-slate-500">How much time can you study per day?</p>
                  <div className="mt-6 grid gap-3">
                    {times.map((item) => (
                      <button key={item} onClick={() => setDailyTime(item)} className={`rounded-xl border px-4 py-4 text-left font-medium ${dailyTime === item ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-700'}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Learning preference</h2>
                  <p className="mt-1 text-slate-500">Choose your favorite learning style.</p>
                  <div className="mt-6 grid gap-3">
                    {preferences.map((item) => (
                      <button key={item} onClick={() => setPreference(item)} className={`rounded-xl border px-4 py-4 text-left font-medium ${preference === item ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-700'}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <h2 className="text-3xl font-bold text-slate-900">Ready to start?</h2>
                  <p className="mt-2 text-slate-500">We will generate your personalized Lingify learning plan now.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex justify-end gap-2">
            {step < 5 ? (
              <button
                type="button"
                onClick={next}
                disabled={!canContinue}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 py-2.5 text-sm font-semibold text-white"
              >
                Generate My Plan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingModal
