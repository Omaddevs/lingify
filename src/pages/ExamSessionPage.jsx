import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle, BookOpen, CheckCircle2, ChevronLeft,
  ChevronRight, Clock, Headphones, Mic, PauseCircle,
  PenLine, PlayCircle, RotateCcw, Trophy, Volume2, X, Zap,
} from 'lucide-react'
import { getCambridgeTest, getListeningBand, getReadingBand, getOverallBand } from '../data/cambridgeIELTS'
import { saveTestResult } from '../data/mockTests'

// ─────────────────────────────────────────────────────────────────────────────
//  COUNTDOWN TIMER
// ─────────────────────────────────────────────────────────────────────────────
function useCountdown(totalSec, onExpire) {
  const [seconds, setSeconds] = useState(totalSec)
  const ref = useRef(null)
  useEffect(() => {
    ref.current = setInterval(() => {
      setSeconds((s) => { if (s <= 1) { clearInterval(ref.current); onExpire?.(); return 0 } return s - 1 })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [onExpire])
  const m = String(Math.floor(seconds / 60)).padStart(2,'0')
  const s = String(seconds % 60).padStart(2,'0')
  return { display: `${m}:${s}`, pct: (seconds/totalSec)*100, isLow: seconds<300, isCritical: seconds<60, seconds }
}

// ─────────────────────────────────────────────────────────────────────────────
//  AUDIO PLAYER
// ─────────────────────────────────────────────────────────────────────────────
function AudioPlayer({ src }) {
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [vol, setVol] = useState(1)

  useEffect(() => {
    const a = ref.current; if (!a) return
    const handlers = {
      timeupdate: () => setCurrent(a.currentTime),
      loadedmetadata: () => setDuration(a.duration),
      ended: () => setPlaying(false),
      play: () => setPlaying(true),
      pause: () => setPlaying(false),
    }
    Object.entries(handlers).forEach(([e,h]) => a.addEventListener(e,h))
    return () => Object.entries(handlers).forEach(([e,h]) => a.removeEventListener(e,h))
  }, [src])

  const toggle = () => { const a = ref.current; if(!a) return; playing ? a.pause() : a.play().catch(()=>{}) }
  const seek   = (e) => {
    const a = ref.current; if (!a||!duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    a.currentTime = ((e.clientX-rect.left)/rect.width)*duration
  }
  const fmt = (s) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-slate-50 p-4 shadow-sm">
      <audio ref={ref} src={src} preload="metadata" />
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow">
          <Headphones size={18} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-indigo-800 truncate">Listening Audio</p>
          <p className="text-[11px] text-indigo-400 truncate">{src.split('/').pop()?.replace('.mp3','')}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Volume2 size={12} className="text-indigo-400" />
          <input type="range" min="0" max="1" step="0.1" value={vol}
            onChange={(e) => { const v=Number(e.target.value); setVol(v); if(ref.current) ref.current.volume=v }}
            className="w-14 accent-indigo-600" />
        </div>
      </div>
      <div className="mb-2 cursor-pointer" onClick={seek}>
        <div className="h-2 overflow-hidden rounded-full bg-indigo-100">
          <div className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: duration ? `${(current/duration)*100}%` : '0%' }} />
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-indigo-400">
          <span>{fmt(current)}</span><span>{duration ? fmt(duration) : '--:--'}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => { if(ref.current) ref.current.currentTime=Math.max(0,current-10) }}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-200 text-indigo-500 hover:bg-indigo-100 transition">
          <ChevronLeft size={16} />
        </button>
        <button onClick={toggle}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition">
          {playing ? <PauseCircle size={24} /> : <PlayCircle size={24} />}
        </button>
        <button onClick={() => { if(ref.current) ref.current.currentTime=Math.min(duration,current+10) }}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-200 text-indigo-500 hover:bg-indigo-100 transition">
          <ChevronRight size={16} />
        </button>
      </div>
      {!playing && current===0 && (
        <p className="mt-2 text-center text-[11px] text-indigo-400">▶ Play bosing — audio boshlanadi</p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  NOTES COMPLETION FORM (IELTS style)
// ─────────────────────────────────────────────────────────────────────────────
function NotesCompletionForm({ section, answers, onChange }) {
  const qs = section.questions || []
  const qMap = Object.fromEntries(qs.map((q) => [q.id, q]))

  // If section has formSections (table layout)
  if (section.formSections) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-sm">
          {/* Form title */}
          {section.formTitle && (
            <div className="bg-slate-800 px-6 py-3 text-center">
              <p className="text-sm font-bold tracking-widest text-white uppercase">{section.formTitle}</p>
            </div>
          )}
          <div className="divide-y divide-slate-100">
            {section.formSections.map((fs) => (
              <div key={fs.label}>
                <div className="bg-indigo-50 px-4 py-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">{fs.label}</p>
                </div>
                <div className="divide-y divide-slate-50">
                  {fs.rows.map((row) => {
                    const q = qMap[row.qId]
                    if (!q) return null
                    const isAnswered = !!(answers[q.id]||'').trim()
                    return (
                      <div key={row.qId} className="flex items-center gap-4 px-5 py-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-black text-white">
                          {q.number}
                        </div>
                        <label className="w-52 shrink-0 text-sm font-medium text-slate-700">{row.label}</label>
                        <div className="flex-1 relative">
                          <input
                            value={answers[q.id] || ''}
                            onChange={(e) => onChange(q.id, e.target.value)}
                            placeholder={row.example || q.placeholder}
                            className={`w-full rounded-lg border-2 px-3 py-1.5 text-sm outline-none transition ${
                              isAnswered
                                ? 'border-indigo-400 bg-indigo-50 text-indigo-900 font-medium'
                                : 'border-slate-200 bg-slate-50 placeholder:text-slate-300 focus:border-indigo-400 focus:bg-white'
                            }`}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Simple list
  return (
    <div className="space-y-3">
      {qs.map((q) => {
        const isAnswered = !!(answers[q.id]||'').trim()
        return (
          <div key={q.id} className={`flex items-center gap-3 rounded-2xl border-2 p-4 transition ${isAnswered ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white'}`}>
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${isAnswered ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              {q.number}
            </span>
            <span className="flex-1 text-sm font-medium text-slate-800">{q.question}</span>
            <input value={answers[q.id]||''} onChange={(e) => onChange(q.id, e.target.value)}
              placeholder={q.placeholder}
              className={`w-48 rounded-xl border-2 px-3 py-1.5 text-sm outline-none transition ${isAnswered ? 'border-indigo-400 bg-white font-semibold text-indigo-900' : 'border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white'}`} />
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  MULTIPLE CHOICE BLOCK
// ─────────────────────────────────────────────────────────────────────────────
function MCQBlock({ question: q, answer, onChange }) {
  return (
    <div className={`rounded-2xl border-2 p-5 transition ${answer ? 'border-indigo-200 bg-indigo-50/40' : 'border-slate-200 bg-white'}`}>
      <div className="mb-3 flex items-start gap-3">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${answer ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
          {q.number}
        </span>
        <p className="text-sm font-semibold leading-5 text-slate-900">{q.question}</p>
      </div>
      <div className="ml-10 space-y-2">
        {q.options.map((opt) => {
          const letter = opt.charAt(0)
          const label  = opt.slice(1).trim()
          const selected = answer === letter
          return (
            <button key={opt} onClick={() => onChange(q.id, letter)}
              className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left text-sm font-medium transition ${
                selected ? 'border-indigo-500 bg-indigo-50 text-indigo-800' : 'border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50'
              }`}>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition ${selected ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-300 text-slate-500'}`}>
                {letter}
              </span>
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  SENTENCE COMPLETION BLOCK
// ─────────────────────────────────────────────────────────────────────────────
function SentenceCompletionBlock({ sentences, questions, answers, onChange }) {
  const qMap = Object.fromEntries((questions||[]).map((q) => [q.id, q]))
  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="divide-y divide-slate-100">
        {(sentences||[]).map((s) => {
          const q = qMap[s.qId]
          if (!q) return null
          const val = answers[q.id] || ''
          const isAnswered = !!val.trim()
          return (
            <div key={s.qId} className={`flex flex-wrap items-center gap-2 px-5 py-3.5 transition ${isAnswered ? 'bg-indigo-50/40' : ''}`}>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${isAnswered ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {s.num}
              </span>
              <span className="text-sm text-slate-800">{s.before}</span>
              <input value={val} onChange={(e) => onChange(q.id, e.target.value)}
                placeholder="______"
                className={`rounded-lg border-2 px-2.5 py-1 text-sm font-semibold outline-none transition w-36 text-center ${
                  isAnswered ? 'border-indigo-400 bg-white text-indigo-900' : 'border-dashed border-slate-300 bg-slate-50 focus:border-indigo-400 focus:bg-white'
                }`} />
              {s.after && <span className="text-sm text-slate-800">{s.after}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  MATCHING HEADINGS BLOCK
// ─────────────────────────────────────────────────────────────────────────────
function MatchingBlock({ group, answers, onChange }) {
  return (
    <div className="space-y-3">
      {group.headingList && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-700">List of Headings</p>
          <div className="space-y-1">
            {group.headingList.map((h) => (
              <p key={h} className="text-sm text-amber-900 font-mono leading-6">{h}</p>
            ))}
          </div>
        </div>
      )}
      {group.questions.map((q) => {
        const val = answers[q.id] || ''
        return (
          <div key={q.id} className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-3.5 transition ${val ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-white'}`}>
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${val ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              {q.number}
            </span>
            <span className="flex-1 text-sm font-semibold text-slate-800">{q.question}</span>
            <select value={val} onChange={(e) => onChange(q.id, e.target.value)}
              className={`rounded-xl border-2 px-3 py-1.5 text-sm font-bold outline-none transition ${val ? 'border-indigo-400 bg-white text-indigo-900' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
              <option value="">— Tanlang —</option>
              {q.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  QUESTION GROUP RENDERER
// ─────────────────────────────────────────────────────────────────────────────
function QuestionGroup({ group, answers, onChange }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
        <p className="text-xs font-black uppercase tracking-widest text-indigo-600">{group.label}</p>
        <p className="mt-0.5 text-xs text-indigo-700 whitespace-pre-line">{group.instructions}</p>
      </div>

      {/* Matching headings */}
      {group.type === 'matching_headings' && <MatchingBlock group={group} answers={answers} onChange={onChange} />}

      {/* T/F/NG */}
      {group.type === 'true_false_ng' && (
        <div className="space-y-2">
          {group.questions.map((q) => {
            const val = answers[q.id] || ''
            return (
              <div key={q.id} className={`rounded-2xl border-2 p-4 transition ${val ? 'border-indigo-200 bg-indigo-50/40' : 'border-slate-200 bg-white'}`}>
                <div className="mb-3 flex items-start gap-3">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${val ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{q.number}</span>
                  <p className="text-sm font-medium leading-5 text-slate-900">{q.question}</p>
                </div>
                <div className="ml-10 flex gap-2">
                  {q.options.map((opt) => (
                    <button key={opt} onClick={() => onChange(q.id, opt)}
                      className={`flex-1 rounded-xl border-2 py-2 text-xs font-bold transition ${
                        val === opt
                          ? opt === 'TRUE'     ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : opt === 'FALSE'    ? 'border-red-400 bg-red-50 text-red-800'
                          :                     'border-amber-400 bg-amber-50 text-amber-800'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Multiple choice */}
      {group.type === 'multiple_choice' && (
        <div className="space-y-3">
          {group.questions.map((q) => (
            <MCQBlock key={q.id} question={q} answer={answers[q.id]||''} onChange={onChange} />
          ))}
        </div>
      )}

      {/* Sentence completion */}
      {group.type === 'sentence_completion' && (
        <SentenceCompletionBlock sentences={group.sentences} questions={group.questions} answers={answers} onChange={onChange} />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  LISTENING SECTION
// ─────────────────────────────────────────────────────────────────────────────
function ListeningSection({ listeningData, answers, onChange }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const section = listeningData.sections[activeIdx]

  const totalQs    = listeningData.sections.reduce((s,sec) => s + (sec.questions?.length||0), 0)
  const answeredQs = listeningData.sections.reduce((s,sec) => s + (sec.questions?.filter((q) => (answers[q.id]||'').trim()).length||0), 0)

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      {/* Left panel */}
      <aside className="space-y-3">
        {/* Section tabs */}
        <div className="flex gap-1.5">
          {listeningData.sections.map((s,i) => {
            const done = s.questions?.filter((q) => (answers[q.id]||'').trim()).length || 0
            const total = s.questions?.length || 0
            return (
              <button key={s.id} onClick={() => setActiveIdx(i)}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                  activeIdx === i ? 'bg-indigo-600 text-white shadow-md' :
                  done === total && total > 0 ? 'bg-emerald-100 text-emerald-700' :
                  'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                Sec {s.number}
                {done > 0 && <span className="ml-1 opacity-70">({done}/{total})</span>}
              </button>
            )
          })}
        </div>

        {/* Audio player */}
        <AudioPlayer src={section.audio} />

        {/* Instructions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-1 text-[11px] font-black uppercase tracking-widest text-slate-400">
            SECTION {section.number} — Ko'rsatmalar
          </p>
          <p className="text-xs font-semibold text-indigo-700">{section.instructions}</p>
          {section.context && (
            <p className="mt-2 text-xs leading-5 text-slate-500 border-t border-slate-100 pt-2">{section.context}</p>
          )}
        </div>

        {/* Progress */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
          <p className="text-xs text-slate-400">Jami progress</p>
          <p className="text-xl font-black text-slate-900">{answeredQs} / {totalQs}</p>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${totalQs ? (answeredQs/totalQs)*100 : 0}%` }} />
          </div>
        </div>
      </aside>

      {/* Right panel — questions */}
      <main className="overflow-y-auto pb-20 xl:max-h-[75vh] xl:pb-0 space-y-5">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900">{section.title}</h3>
        </div>

        {/* Notes / form completion */}
        {(section.questionType === 'notes_completion' || section.formSections) && (
          <NotesCompletionForm section={section} answers={answers} onChange={onChange} />
        )}

        {/* Mixed: MCQ + sentence */}
        {section.questionType === 'mixed' && (
          <div className="space-y-5">
            {section.partA && (
              <div>
                <div className="mb-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2.5">
                  <p className="text-xs font-black uppercase tracking-wider text-indigo-600">{section.partA.label}</p>
                  <p className="text-xs text-indigo-700">{section.partA.instructions}</p>
                </div>
                <div className="space-y-3">
                  {section.questions.filter((q) => q.type === 'multiple_choice').map((q) => (
                    <MCQBlock key={q.id} question={q} answer={answers[q.id]||''} onChange={onChange} />
                  ))}
                </div>
              </div>
            )}

            {section.partB && (
              <div>
                <div className="mb-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2.5">
                  <p className="text-xs font-black uppercase tracking-wider text-indigo-600">{section.partB.label}</p>
                  <p className="text-xs text-indigo-700">{section.partB.instructions}</p>
                </div>
                {section.partB.sentences ? (
                  <SentenceCompletionBlock
                    sentences={section.partB.sentences}
                    questions={section.questions.filter((q) => q.type === 'text')}
                    answers={answers}
                    onChange={onChange} />
                ) : section.partB.options ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="mb-3 text-xs font-bold text-amber-700">Variants:</p>
                    <div className="grid grid-cols-2 gap-1 mb-4">
                      {section.partB.options.map((o) => (
                        <p key={o} className="text-xs text-amber-900 font-mono">{o}</p>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {section.questions.filter((q) => q.type === 'choose_multiple').map((q) => {
                        const val = answers[q.id] || ''
                        return (
                          <div key={q.id} className="flex items-center gap-3">
                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${val ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{q.number}</span>
                            <select value={val} onChange={(e) => onChange(q.id, e.target.value)}
                              className="flex-1 rounded-xl border-2 border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-400">
                              <option value="">— Harf tanlang —</option>
                              {q.options.map((o) => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  READING SECTION
// ─────────────────────────────────────────────────────────────────────────────
function ReadingSection({ readingData, answers, onChange }) {
  const [passageIdx, setPassageIdx] = useState(0)
  const passage = readingData.passages[passageIdx]

  const totalQs    = readingData.passages.reduce((s,p) => s + (p.questions?.length||0), 0)
  const answeredQs = readingData.passages.reduce((s,p) => s + (p.questions?.filter((q) => (answers[q.id]||'').trim()).length||0), 0)

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_520px]">
      {/* Passage text */}
      <div className="space-y-3">
        <div className="flex gap-1.5">
          {readingData.passages.map((p,i) => {
            const done = p.questions?.filter((q) => (answers[q.id]||'').trim()).length || 0
            const total = p.questions?.length || 0
            return (
              <button key={p.id} onClick={() => setPassageIdx(i)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  passageIdx === i ? 'bg-emerald-600 text-white shadow-md' :
                  done === total && total > 0 ? 'bg-emerald-100 text-emerald-700' :
                  'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                Passage {p.number}
                <span className="ml-1 opacity-70 text-[10px]">({p.questions_range})</span>
              </button>
            )
          })}
          <div className="ml-auto flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            <CheckCircle2 size={12} className="text-emerald-500" />
            {answeredQs}/{totalQs}
          </div>
        </div>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-1 text-lg font-black text-slate-900">{passage.title}</h3>
          <div className="max-h-[68vh] overflow-y-auto pr-2 space-y-4">
            {passage.text.split(/\n\n+/).map((para, i) => (
              <p key={i} className="text-sm leading-8 text-slate-700"
                dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
            ))}
          </div>
        </article>
      </div>

      {/* Questions panel */}
      <aside className="space-y-5 overflow-y-auto pb-20 xl:max-h-[80vh] xl:pb-0">
        {passage.questionGroups ? (
          passage.questionGroups.map((group, gi) => (
            <QuestionGroup key={gi} group={group} answers={answers} onChange={onChange} />
          ))
        ) : (
          /* Fallback: flat questions */
          <div className="space-y-3">
            {passage.questions?.map((q) => {
              if (q.type === 'multiple_choice') return <MCQBlock key={q.id} question={q} answer={answers[q.id]||''} onChange={onChange} />
              if (q.type === 'true_false_ng') {
                const val = answers[q.id] || ''
                return (
                  <div key={q.id} className={`rounded-2xl border-2 p-4 ${val ? 'border-indigo-200 bg-indigo-50/40' : 'border-slate-200 bg-white'}`}>
                    <div className="mb-2 flex items-start gap-2">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${val ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{q.number}</span>
                      <p className="text-sm font-medium text-slate-900">{q.question}</p>
                    </div>
                    <div className="ml-9 flex gap-2">
                      {q.options.map((opt) => (
                        <button key={opt} onClick={() => onChange(q.id, opt)}
                          className={`flex-1 rounded-xl border-2 py-1.5 text-xs font-bold transition ${val===opt ? 'border-indigo-500 bg-indigo-50 text-indigo-800' : 'border-slate-200 hover:border-slate-300'}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              }
              return (
                <div key={q.id} className={`flex items-center gap-3 rounded-2xl border-2 p-3.5 transition ${(answers[q.id]||'').trim() ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-white'}`}>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${(answers[q.id]||'').trim() ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{q.number}</span>
                  <input value={answers[q.id]||''} onChange={(e) => onChange(q.id, e.target.value)}
                    placeholder={q.placeholder || 'ONE WORD...'}
                    className="flex-1 rounded-xl border-2 border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-400 bg-white" />
                </div>
              )
            })}
          </div>
        )}
      </aside>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  WRITING SECTION
// ─────────────────────────────────────────────────────────────────────────────
function WritingSection({ writingData, answers, onChange }) {
  const [activeTask, setActiveTask] = useState(0)
  const tasks = [writingData.task1, writingData.task2]
  const task  = tasks[activeTask]
  const text  = answers[`writing_task${activeTask+1}`] || ''
  const wc    = text.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {tasks.map((t,i) => (
          <button key={i} onClick={() => setActiveTask(i)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${activeTask===i ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            Task {i+1} {answers[`writing_task${i+1}`]?.trim() && <span className="ml-1 text-emerald-400">✓</span>}
          </button>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <PenLine size={15} className="text-amber-500" />
            <p className="font-bold text-slate-900">{task.title}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 max-h-96 overflow-y-auto">
            <p className="whitespace-pre-line text-sm leading-7 text-slate-700">{task.prompt}</p>
          </div>
          {task.assessmentCriteria && (
            <div className="mt-3 space-y-1 border-t border-slate-100 pt-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Baholash mezoni</p>
              {task.assessmentCriteria.map((c) => (
                <p key={c} className="flex items-start gap-1 text-xs text-slate-500">
                  <span className="text-amber-400 shrink-0">•</span>{c}
                </p>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-700">Javobingiz:</p>
            <span className={`rounded-lg px-2 py-1 text-xs font-bold ${wc>=(task.minWords||150) ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {wc} so'z / Min: {task.minWords||150}
            </span>
          </div>
          <textarea value={text} onChange={(e) => onChange(`writing_task${activeTask+1}`, e.target.value)}
            placeholder={`Task ${activeTask+1} javobingizni shu yerga yozing...`}
            className="flex-1 min-h-96 resize-none rounded-2xl border border-slate-200 p-4 text-sm leading-7 text-slate-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  SPEAKING SECTION
// ─────────────────────────────────────────────────────────────────────────────
function SpeakingSection({ speakingData }) {
  const [activePart, setActivePart] = useState(0)
  const [recording, setRecording] = useState(false)
  const [recorded, setRecorded] = useState({})
  const part = speakingData.parts[activePart]
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex gap-2">
        {speakingData.parts.map((p,i) => (
          <button key={i} onClick={() => setActivePart(i)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${activePart===i ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            Part {p.part} {recorded[i] && <span className="text-emerald-300">✓</span>}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5">
        <h3 className="font-bold text-violet-900">{part.title}</h3>
        <p className="mt-1 text-sm text-violet-700">{part.instructions}</p>
      </div>
      {part.cueCard && (
        <div className="rounded-2xl border-2 border-dashed border-violet-300 bg-white p-6">
          <p className="text-xs font-black uppercase tracking-widest text-violet-400 mb-2">Cue Card</p>
          <p className="text-lg font-bold text-slate-900">{part.cueCard.topic}</p>
          <ul className="mt-3 space-y-2">
            {part.cueCard.points.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />{p}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        {part.questions?.map((q,i) => (
          <div key={i} className="rounded-xl border border-slate-100 bg-white p-4">
            <p className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-0.5 shrink-0 font-bold text-violet-500">{i+1}.</span>{q}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button onClick={() => { setRecording((v)=>!v); if(recording) setRecorded((r)=>({...r,[activePart]:true})) }}
          className={`flex items-center gap-3 rounded-2xl px-8 py-4 text-sm font-bold transition ${recording ? 'bg-red-500 text-white animate-pulse' : 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-md'}`}>
          <Mic size={18} />{recording ? '◼ To\'xtatish' : '▶ Yozishni boshlash'}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  RESULTS
// ─────────────────────────────────────────────────────────────────────────────
function ResultsPage({ test, answers, navigate }) {
  const allLQs = test.listening?.sections.flatMap((s) => s.questions) || []
  const allRQs = test.reading?.passages.flatMap((p) => p.questions) || []

  function countCorrect(qs, ans) {
    return qs.filter((q) => {
      const a = (ans[q.id]||'').trim().toLowerCase()
      const c = (q.answer||'').trim().toLowerCase()
      return a && c && (a === c || a.includes(c) || c.includes(a))
    }).length
  }

  const lc = countCorrect(allLQs, answers.listening||{})
  const rc = countCorrect(allRQs, answers.reading||{})
  const lb = getListeningBand(lc)
  const rb = getReadingBand(rc)
  const ob = getOverallBand(lb, rb)

  useEffect(() => {
    saveTestResult({ testId: test.id, testTitle: `${test.book} — ${test.test}`, testType: 'IELTS',
      correct: lc+rc, total: allLQs.length+allRQs.length, band: ob, listeningBand: lb, readingBand: rb })
  }, [])

  return (
    <div className="mx-auto max-w-2xl py-10 text-center">
      <div className="mb-4 flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100">
          <Trophy size={40} className="text-indigo-600" />
        </div>
      </div>
      <h2 className="text-3xl font-black text-slate-900">Test yakunlandi! 🎉</h2>
      <p className="mt-1 text-slate-500">{test.book} — {test.test}</p>
      <div className="mx-auto mt-6 flex h-32 w-32 flex-col items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl">
        <p className="text-5xl font-black">{ob}</p>
        <p className="text-xs opacity-80">Overall Band</p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Listening', val: `${lc}/${allLQs.length}`, band: lb, color: 'bg-sky-50 border-sky-200' },
          { label: 'Reading',   val: `${rc}/${allRQs.length}`, band: rb, color: 'bg-emerald-50 border-emerald-200' },
          { label: 'Writing',   val: '—', band: '~6.0', color: 'bg-amber-50 border-amber-200' },
          { label: 'Speaking',  val: '—', band: '~6.0', color: 'bg-violet-50 border-violet-200' },
        ].map(({ label, val, band, color }) => (
          <div key={label} className={`rounded-2xl border p-4 ${color}`}>
            <p className="text-xs font-semibold text-slate-500">{label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{band}</p>
            <p className="text-xs text-slate-400">{val}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button onClick={() => navigate('/mock-exam')}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <RotateCcw size={14} />Boshqa test
        </button>
        <button onClick={() => navigate('/progress')}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-md">
          <Zap size={14} />Progressni ko'rish
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  TRANSFER TIME
// ─────────────────────────────────────────────────────────────────────────────
function TransferScreen({ onDone }) {
  const timer = useCountdown(10 * 60, onDone)
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-100">
        <Clock size={36} className="text-amber-600" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900">Javoblarni ko'chirish vaqti</h3>
      <p className="mt-2 text-slate-500">10 daqiqa — javoblarni asosiy qog'ozga ko'chiring</p>
      <div className={`mt-6 text-6xl font-black ${timer.isCritical ? 'text-red-600 animate-pulse' : 'text-indigo-700'}`}>{timer.display}</div>
      <button onClick={onDone} className="mt-6 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white">
        Keyingi bo'limga o'tish →
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN
// ─────────────────────────────────────────────────────────────────────────────
const SECTION_ORDER = ['listening', 'reading', 'writing', 'speaking']
const SECTION_META = {
  listening: { label: 'Listening', Icon: Headphones, color: 'from-sky-500 to-blue-600',   dur: '30 + 10 daqiqa', questions: 40 },
  reading:   { label: 'Reading',   Icon: BookOpen,   color: 'from-emerald-500 to-teal-600', dur: '60 daqiqa',      questions: 40 },
  writing:   { label: 'Writing',   Icon: PenLine,    color: 'from-amber-500 to-orange-600', dur: '60 daqiqa',      questions: 2  },
  speaking:  { label: 'Speaking',  Icon: Mic,        color: 'from-violet-500 to-purple-700',dur: '11-14 daqiqa',   questions: 3  },
}
const SECTION_DURATIONS = { listening: 30*60, reading: 60*60, writing: 60*60, speaking: 14*60 }

function ExamSessionPage() {
  const { testId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const section  = searchParams.get('section') || 'listening'
  const test     = getCambridgeTest(testId)

  const sidx     = SECTION_ORDER.indexOf(section)
  const meta     = SECTION_META[section]
  const SectionIcon = meta?.Icon || BookOpen

  const [phase,     setPhase]   = useState('intro') // intro | session | transfer | done
  const [answers,   setAnswers] = useState({ listening:{}, reading:{}, writing:{}, speaking:{} })
  const [showExit,  setShowExit]= useState(false)

  const timer = useCountdown(SECTION_DURATIONS[section] || 60*60, () => setPhase(section==='listening' ? 'transfer' : 'done'))

  function handleAnswer(qId, val) {
    setAnswers((prev) => ({ ...prev, [section]: { ...prev[section], [qId]: val } }))
  }

  const answered = Object.keys(answers[section]||{}).length
  const totalQ   = section==='listening' ? 40 : section==='reading' ? 40 : section==='writing' ? 2 : 3

  if (!test) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-slate-500">Test topilmadi</p>
        <button onClick={() => navigate('/mock-exam')} className="mt-3 text-sm text-indigo-600 font-medium">Orqaga</button>
      </div>
    </div>
  )

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === 'intro') return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg text-center">
        {/* Section steps */}
        <div className="mb-6 flex items-center justify-center gap-1">
          {SECTION_ORDER.map((s,i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i<sidx ? 'bg-emerald-500 text-white' : i===sidx ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {i<sidx ? '✓' : i+1}
              </div>
              {i<3 && <div className={`h-0.5 w-7 ${i<sidx ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>
        <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br text-white shadow-lg ${meta.color}`}>
          <SectionIcon size={36} />
        </div>
        <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
          {test.book} — {test.test}
        </div>
        <h2 className="mt-2 text-3xl font-black text-slate-900">IELTS {meta.label}</h2>
        <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
          {[{l:'Vaqt',v:meta.dur},{l:'Savollar',v:`${meta.questions} ta`},{l:'Band',v:'0 – 9'}].map(({l,v}) => (
            <div key={l} className="rounded-2xl bg-slate-50 p-3"><p className="font-black text-slate-900">{v}</p><p className="text-xs text-slate-400">{l}</p></div>
          ))}
        </div>
        {section==='listening' && (
          <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50 p-4 text-left text-xs text-sky-800">
            <p className="font-bold mb-1">📢 Ko'rsatmalar:</p>
            <p>• Audio har sectionda bir marta o'ynatiladi</p>
            <p>• Javoblarni o'qib yozish uchun 10 daqiqa qo'shimcha beriladi</p>
            <p>• ONE WORD AND/OR A NUMBER formatida yozing</p>
          </div>
        )}
        <div className="mt-6 flex gap-3">
          <button onClick={() => navigate('/mock-exam')}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <ChevronLeft size={14} />Orqaga
          </button>
          <button onClick={() => { setPhase('session'); timer.start?.() }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r text-white shadow-md font-bold text-sm py-3 ${meta.color}`}>
            Boshlash <ChevronRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  )

  // ── TRANSFER ───────────────────────────────────────────────────────────────
  if (phase === 'transfer') return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <TransferScreen onDone={() => setPhase('done')} />
      </div>
    </div>
  )

  // ── DONE ───────────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const nextSection = SECTION_ORDER[sidx+1]
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        {nextSection ? (
          <div className="mx-auto max-w-xl text-center">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 size={40} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">{meta.label} yakunlandi! ✅</h3>
              <p className="mt-2 text-sm text-slate-500">{answered} ta savol javoblandi</p>
              <div className="mt-6 flex flex-col gap-3">
                <button onClick={() => navigate(`/exam/${testId}?section=${nextSection}`)}
                  className={`flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r text-white shadow-md font-bold py-3 text-sm ${SECTION_META[nextSection].color}`}>
                  Keyingi: {SECTION_META[nextSection].label} <ChevronRight size={15} />
                </button>
                <button onClick={() => navigate('/mock-exam')}
                  className="rounded-2xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Mock Exam ga qaytish
                </button>
              </div>
            </div>
          </div>
        ) : (
          <ResultsPage test={test} answers={answers} navigate={navigate} />
        )}
      </div>
    )
  }

  // ── SESSION ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      {showExit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}
            className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
            <AlertTriangle size={28} className="mx-auto mb-3 text-amber-500" />
            <h3 className="text-xl font-bold text-slate-900">Testdan chiqasizmi?</h3>
            <p className="mt-2 text-sm text-slate-500">Barcha javoblar yo'qoladi.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setShowExit(false)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium">Davom etish</button>
              <button onClick={() => navigate('/mock-exam')} className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white">Chiqish</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Top bar */}
      <div className={`sticky top-0 z-30 border-b bg-white px-4 py-3 shadow-sm ${timer.isCritical ? 'border-red-200' : 'border-slate-200'}`}>
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <button onClick={() => setShowExit(true)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 shrink-0">
            <X size={15} />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white ${meta.color}`}>
              <SectionIcon size={13} />
            </div>
            <p className="text-sm font-bold text-slate-900 truncate">{test.book} — {test.test} | {meta.label}</p>
          </div>
          <div className={`ml-auto flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-black shrink-0 ${timer.isCritical ? 'bg-red-500 text-white animate-pulse' : timer.isLow ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
            <Clock size={14} />{timer.display}
          </div>
          <div className="hidden items-center gap-1 text-xs text-slate-500 sm:flex shrink-0">
            <span className="font-bold text-slate-800">{answered}</span>/<span>{totalQ}</span>
          </div>
          <button onClick={() => setPhase(section==='listening' ? 'transfer' : 'done')}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-md">
            <CheckCircle2 size={13} />Topshirish
          </button>
        </div>
        {/* Timer bar */}
        <div className="mx-auto mt-1.5 max-w-7xl">
          <div className="h-1 overflow-hidden rounded-full bg-slate-100">
            <motion.div className={`h-full rounded-full bg-gradient-to-r ${meta.color}`}
              animate={{ width: `${timer.pct}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-5">
        {section === 'listening' && test.listening && (
          <ListeningSection listeningData={test.listening} answers={answers.listening} onChange={handleAnswer} />
        )}
        {section === 'reading' && test.reading && (
          <ReadingSection readingData={test.reading} answers={answers.reading} onChange={handleAnswer} />
        )}
        {section === 'writing' && test.writing && (
          <WritingSection writingData={test.writing} answers={answers.writing}
            onChange={(k,v) => setAnswers((p) => ({...p, writing:{...p.writing,[k]:v}}))} />
        )}
        {section === 'speaking' && test.speaking && (
          <SpeakingSection speakingData={test.speaking} />
        )}
        <div className="mt-6 flex justify-end pb-16 xl:pb-0">
          <button onClick={() => setPhase(section==='listening' ? 'transfer' : 'done')}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg">
            <CheckCircle2 size={15} />Testni yakunlash
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExamSessionPage
