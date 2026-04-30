import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, BookOpen, CheckCircle2, ChevronDown, ChevronRight,
  Lock, MessageSquare, Pause, Play, SkipBack, SkipForward,
  Star, Trophy, Users, Volume2, VolumeX,
} from 'lucide-react'

// ── Mock course data ──────────────────────────────────────────────────────────
const MOCK_COURSE = {
  id: 'c1',
  title: 'IELTS 7.0+ Masterclass',
  teacher: { name: 'Jasur Karimov', avatar: null, rating: 4.9 },
  level: 'B2',
  totalLessons: 12,
  totalHours: '6 soat',
  enrolled: 1240,
  rating: 4.9,
  sections: [
    {
      id: 's1', title: 'Kirish va asoslar', lessons: [
        { id:'l1', title:'IELTS haqida to\'liq ma\'lumot', duration:'12:30', free:true, completed:true },
        { id:'l2', title:'Band score tizimi',              duration:'08:45', free:true, completed:true },
        { id:'l3', title:'Test formati va strategiya',    duration:'15:20', free:false, completed:false },
      ]
    },
    {
      id: 's2', title: 'Listening bo\'limi', lessons: [
        { id:'l4', title:'Section 1: Form completion',   duration:'18:00', free:false, completed:false },
        { id:'l5', title:'Section 2: Multiple choice',   duration:'16:40', free:false, completed:false },
        { id:'l6', title:'Section 3: Matching',          duration:'20:15', free:false, completed:false },
      ]
    },
    {
      id: 's3', title: 'Reading bo\'limi', lessons: [
        { id:'l7', title:'True/False/Not Given strategiyasi',duration:'22:10', free:false, completed:false },
        { id:'l8', title:'Matching headings',             duration:'19:30', free:false, completed:false },
        { id:'l9', title:'Summary completion',            duration:'17:45', free:false, completed:false },
      ]
    },
    {
      id: 's4', title: 'Writing va Speaking', lessons: [
        { id:'l10', title:'Task 1: Grafik tavsifi',       duration:'25:00', free:false, completed:false },
        { id:'l11', title:'Task 2: Essay yozish',         duration:'30:00', free:false, completed:false },
        { id:'l12', title:'Speaking: 3 qismning sirlari', duration:'28:00', free:false, completed:false },
      ]
    },
  ],
}

function VideoPlayer({ lesson }) {
  const videoRef  = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted,   setMuted]   = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration,setDuration]= useState(0)
  const [showControls, setShowControls] = useState(true)

  function toggle() {
    const v = videoRef.current
    if (!v) return
    if (playing) v.pause()
    else v.play().catch(() => {})
    setPlaying((p) => !p)
  }

  function fmt(s) {
    const m = Math.floor(s/60), ss = Math.floor(s%60)
    return `${m}:${String(ss).padStart(2,'0')}`
  }

  // Simulated video player (no actual video source needed for demo)
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-slate-900"
      style={{ aspectRatio: '16/9' }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !playing && setShowControls(true)}
    >
      {/* Video placeholder */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-center">
        <div className="mb-3 text-4xl">🎬</div>
        <p className="text-base font-bold text-white">{lesson.title}</p>
        <p className="mt-1 text-sm text-slate-400">{lesson.duration}</p>
        <p className="mt-3 text-xs text-slate-500">
          Demo rejimda video ko'rsatilmaydi.<br />
          Real serverda YouTube/Cloudinary URL kerak.
        </p>
      </div>

      {/* Controls overlay */}
      <motion.div
        initial={false}
        animate={{ opacity: showControls ? 1 : 0 }}
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-8"
      >
        {/* Progress bar */}
        <div className="mb-3 h-1 cursor-pointer overflow-hidden rounded-full bg-white/30"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const pct = (e.clientX - rect.left) / rect.width
            if (videoRef.current) videoRef.current.currentTime = pct * duration
          }}>
          <div className="h-full rounded-full bg-indigo-500" style={{ width: duration ? `${(current/duration)*100}%` : '0%' }} />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition">
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button onClick={() => setMuted((v) => !v)} className="text-white/70 hover:text-white transition">
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <span className="text-xs text-white/70">{fmt(current)} / {fmt(duration || 0)}</span>
          <div className="flex-1" />
          <span className="text-xs font-semibold text-white">{lesson.duration}</span>
        </div>
      </motion.div>
    </div>
  )
}

function VideoCoursePage() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const course = MOCK_COURSE
  const [activeLesson, setActiveLesson] = useState(course.sections[0].lessons[0])
  const [expandedSection, setExpandedSection] = useState('s1')
  const [completed, setCompleted] = useState(new Set(['l1','l2']))
  const [activeTab, setActiveTab] = useState('overview') // overview | qa

  const totalCompleted = [...completed].filter((id) =>
    course.sections.flatMap((s) => s.lessons).find((l) => l.id === id)
  ).length
  const totalLessons = course.sections.reduce((s, sec) => s + sec.lessons.length, 0)
  const pct = Math.round((totalCompleted / totalLessons) * 100)

  function completeLesson() {
    setCompleted((p) => new Set([...p, activeLesson.id]))
    // Find next lesson
    const allLessons = course.sections.flatMap((s) => s.lessons)
    const idx = allLessons.findIndex((l) => l.id === activeLesson.id)
    if (idx < allLessons.length - 1) setActiveLesson(allLessons[idx + 1])
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-700 bg-slate-900 px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <button onClick={() => navigate('/teachers')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 transition shrink-0">
            <ArrowLeft size={15} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-bold text-white">{course.title}</p>
            <p className="text-[11px] text-slate-400">{course.teacher.name} · {activeLesson.title}</p>
          </div>
          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-700">
              <div className="h-full rounded-full bg-indigo-500" style={{ width:`${pct}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-300">{pct}%</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-0 xl:gap-6 p-0 xl:p-4 xl:pt-5">
        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">
          {/* Video */}
          <VideoPlayer lesson={activeLesson} />

          {/* Lesson info */}
          <div className="bg-slate-900 p-4 xl:rounded-2xl xl:border xl:border-slate-700 xl:mt-4 xl:bg-slate-800">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-white">{activeLesson.title}</h2>
                <p className="mt-0.5 text-sm text-slate-400">{activeLesson.duration} · {course.teacher.name}</p>
              </div>
              <button onClick={completeLesson}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                  completed.has(activeLesson.id)
                    ? 'bg-emerald-600/20 text-emerald-400 cursor-default'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'
                }`}>
                <CheckCircle2 size={15} />
                {completed.has(activeLesson.id) ? 'Bajarildi ✓' : 'Bajarildi deb belgilash'}
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-4 flex gap-4 border-b border-slate-700">
              {['overview', 'qa'].map((t) => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`pb-3 text-sm font-semibold transition ${activeTab === t ? 'border-b-2 border-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                  {t === 'overview' ? 'Dars haqida' : 'Savollar (3)'}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p>Ushbu darsda {activeLesson.title.toLowerCase()} haqida to'liq ma'lumot beriladi.</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    { icon: BookOpen, label: 'Dars uzunligi', val: activeLesson.duration },
                    { icon: Users,    label: 'O\'quvchilar',  val: '1,240' },
                    { icon: Star,     label: 'Reyting',       val: '4.9 ⭐' },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label} className="flex items-center gap-2 rounded-xl bg-slate-700/50 p-3">
                      <Icon size={14} className="text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-400">{label}</p>
                        <p className="text-xs font-bold text-white">{val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="mt-4 space-y-3">
                {[
                  { q: 'IELTS Listening da bir marta eshitsa bo\'ladimi?', a: 'Ha, haqiqiy imtixonda audio bir marta o\'ynatiladi.' },
                  { q: 'Form completion da qancha so\'z yozish kerak?', a: 'ONE WORD AND/OR A NUMBER — odatda 1-2 so\'z yoki raqam.' },
                ].map(({ q, a }) => (
                  <div key={q} className="rounded-xl border border-slate-700 bg-slate-800 p-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare size={14} className="mt-0.5 shrink-0 text-indigo-400" />
                      <p className="text-sm font-semibold text-white">{q}</p>
                    </div>
                    <p className="mt-2 text-xs text-slate-400 pl-5">{a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Curriculum sidebar ── */}
        <aside className="hidden w-80 shrink-0 xl:block">
          <div className="rounded-2xl border border-slate-700 bg-slate-800 overflow-hidden">
            <div className="border-b border-slate-700 px-4 py-3">
              <p className="text-sm font-black text-white">Kurs mazmuni</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {totalCompleted}/{totalLessons} dars · {pct}% bajarildi
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700">
                <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width:`${pct}%` }} />
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {course.sections.map((section) => (
                <div key={section.id}>
                  <button onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-700/50 transition">
                    <p className="text-xs font-bold text-slate-300">{section.title}</p>
                    <ChevronDown size={14} className={`text-slate-500 transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`} />
                  </button>

                  {expandedSection === section.id && (
                    <div className="border-t border-slate-700/50">
                      {section.lessons.map((lesson) => {
                        const isActive = activeLesson.id === lesson.id
                        const isDone   = completed.has(lesson.id)
                        return (
                          <button key={lesson.id}
                            onClick={() => lesson.free || true ? setActiveLesson(lesson) : null}
                            className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${isActive ? 'bg-indigo-600/20' : 'hover:bg-slate-700/50'}`}>
                            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isDone ? 'border-emerald-500 bg-emerald-500' : isActive ? 'border-indigo-500' : 'border-slate-600'}`}>
                              {isDone
                                ? <CheckCircle2 size={12} className="text-white" />
                                : !lesson.free && !isDone
                                ? <Lock size={10} className="text-slate-500" />
                                : isActive ? <Play size={10} className="text-indigo-400" /> : null}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                {lesson.title}
                              </p>
                              <p className="text-[10px] text-slate-500">{lesson.duration}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Trophy */}
            {totalCompleted === totalLessons && (
              <div className="border-t border-slate-700 px-4 py-4 text-center">
                <Trophy size={24} className="mx-auto mb-2 text-amber-400" />
                <p className="text-sm font-black text-white">Kurs tugallandi! 🎉</p>
                <button onClick={() => navigate('/certificate')}
                  className="mt-2 w-full rounded-xl bg-amber-500 py-2 text-xs font-bold text-white hover:bg-amber-600 transition">
                  Sertifikat olish
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default VideoCoursePage
