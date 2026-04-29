import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Award, BookOpen, Calendar, ChevronRight, Crown,
  Download, Printer, Share2, Star, Trophy,
} from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useLessonProgress } from '../hooks/useVocabulary'
import { getTestResults } from '../data/mockTests'
import { curriculum, LEVEL_LABELS } from '../data/curriculum'
import Sidebar from '../components/Sidebar'
import MobileBottomNav from '../components/Cards/MobileBottomNav'

// ─────────────────────────────────────────────────────────────────────────────
//  CERTIFICATE TYPES
// ─────────────────────────────────────────────────────────────────────────────
const CERT_TYPES = [
  {
    id:       'level',
    title:    'Daraja Sertifikati',
    subtitle: 'English Level Certificate',
    color:    'from-indigo-600 to-violet-700',
    border:   'border-indigo-300',
    bg:       'from-indigo-50 to-violet-50',
    icon:     '🎓',
    badge:    'from-indigo-500 to-violet-600',
    desc:     'Joriy ingliz tili darajangizni tasdiqlovchi sertifikat',
    premium:  false,
  },
  {
    id:       'ielts',
    title:    'IELTS Mock Sertifikati',
    subtitle: 'IELTS Mock Test Achievement',
    color:    'from-emerald-600 to-teal-700',
    border:   'border-emerald-300',
    bg:       'from-emerald-50 to-teal-50',
    icon:     '📋',
    badge:    'from-emerald-500 to-teal-600',
    desc:     'IELTS mock test natijangizni tasdiqlovchi sertifikat',
    premium:  false,
  },
  {
    id:       'course',
    title:    'Kurs Tugatish Sertifikati',
    subtitle: 'Course Completion Certificate',
    color:    'from-amber-600 to-orange-700',
    border:   'border-amber-300',
    bg:       'from-amber-50 to-orange-50',
    icon:     '🏆',
    badge:    'from-amber-500 to-orange-600',
    desc:     'Lingify online kursini muvaffaqiyatli tugatganingiz uchun',
    premium:  false,
  },
  {
    id:       'speaking',
    title:    'Speaking Achievement',
    subtitle: 'Speaking Excellence Certificate',
    color:    'from-rose-600 to-pink-700',
    border:   'border-rose-300',
    bg:       'from-rose-50 to-pink-50',
    icon:     '🎤',
    badge:    'from-rose-500 to-pink-600',
    desc:     'AI Speaking Practice sessiyalarini muvaffaqiyatli tugatganingiz uchun',
    premium:  false,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
//  CERTIFICATE RENDER
// ─────────────────────────────────────────────────────────────────────────────
function CertificateView({ type, user, stats }) {
  const today = new Date().toLocaleDateString('uz-UZ', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const certId = `LNG-${Date.now().toString(36).toUpperCase().slice(-8)}`

  const CONTENT = {
    level: {
      headline: `${LEVEL_LABELS[user?.level] || 'Intermediate'} (${user?.level || 'B1'})`,
      body: `Ushbu sertifikat ${user?.name || 'O\'quvchi'} ingliz tilini muvaffaqiyatli o\'rganib, ${user?.level || 'B1'} darajasiga erishganini tasdiqlayd`,
      achievement: `${stats.completedLessons} ta dars · ${stats.totalWords} ta so'z · ${stats.totalXP} XP`,
    },
    ielts: {
      headline: `Band Score: ${stats.bestBand || '6.5'}`,
      body: `Ushbu sertifikat ${user?.name || 'O\'quvchi'} IELTS Mock Test imtihonida ${stats.bestBand || '6.5'} band score natijasini qo\'lga kiritganini tasdiqlayd`,
      achievement: `${stats.totalTests} ta mock test topshirildi`,
    },
    course: {
      headline: 'Lingify English Course',
      body: `Ushbu sertifikat ${user?.name || 'O\'quvchi'} Lingify platformasidagi ingliz tili kursini muvaffaqiyatli tugatganini tasdiqlayd`,
      achievement: `${stats.completedLessons} ta dars · ${curriculum.length} ta moduldan`,
    },
    speaking: {
      headline: 'Speaking Excellence',
      body: `Ushbu sertifikat ${user?.name || 'O\'quvchi'} AI Speaking Practice sessiyalarini muvaffaqiyatli tugatib, gapirish ko'nikmasini yaxshilaganini tasdiqlayd`,
      achievement: `AI bilan ${stats.totalXP > 100 ? '10+' : '5+'} ta suhbat sessiyasi`,
    },
  }

  const content = CONTENT[type.id] || CONTENT.level

  return (
    <div
      id="certificate-render"
      className={`relative overflow-hidden rounded-3xl border-4 ${type.border} bg-gradient-to-br ${type.bg} p-8 shadow-2xl`}
      style={{ minHeight: 480, fontFamily: 'Georgia, serif' }}
    >
      {/* Background watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]">
        <span style={{ fontSize: 200 }}>{type.icon}</span>
      </div>

      {/* Corner decorations */}
      {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos) => (
        <div key={pos} className={`absolute ${pos} h-8 w-8 opacity-30`}>
          <div className={`h-full w-full rounded-full bg-gradient-to-br ${type.badge} opacity-50`} />
        </div>
      ))}

      {/* Top border line */}
      <div className={`mb-6 h-1 w-full rounded-full bg-gradient-to-r ${type.color} opacity-60`} />

      {/* Header */}
      <div className="text-center mb-6">
        <div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${type.badge} shadow-lg text-3xl`}>
          {type.icon}
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
          Lingify · O'zbekiston
        </p>
        <h2 className="mt-1 text-2xl font-black text-slate-800">{type.title}</h2>
        <p className="text-sm text-slate-500 italic">{type.subtitle}</p>
      </div>

      {/* Divider */}
      <div className="mx-auto mb-6 flex items-center gap-3 max-w-xs">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-300" />
        <Star size={14} className="text-amber-400 fill-current" />
        <Star size={16} className="text-amber-500 fill-current" />
        <Star size={14} className="text-amber-400 fill-current" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-300" />
      </div>

      {/* Body text */}
      <div className="text-center mb-5">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">
          Ushbu sertifikat taqdim etiladi
        </p>
        <p className="text-3xl font-black text-slate-900 mb-3">
          {user?.name || 'O\'quvchi'}
        </p>
        <p className="text-sm leading-7 text-slate-600 max-w-lg mx-auto">
          {content.body}i.
        </p>
        <div className={`mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r ${type.badge} px-5 py-2.5 text-white shadow-md`}>
          <Trophy size={16} />
          <span className="text-sm font-black">{content.headline}</span>
        </div>
        <p className="mt-3 text-xs text-slate-500">{content.achievement}</p>
      </div>

      {/* Footer */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="mx-auto mb-1 h-10 w-32 border-b border-slate-400" />
          <p className="text-xs text-slate-500">Direktor imzosi</p>
          <p className="text-[11px] text-slate-400">Lingify CEO</p>
        </div>
        <div>
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-300">
            <Award size={18} className="text-slate-400" />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Rasmiy muhr</p>
        </div>
        <div>
          <div className="mx-auto mb-1 h-10 w-32 border-b border-slate-400" />
          <p className="text-xs text-slate-500">Sana</p>
          <p className="text-[11px] text-slate-400">{today}</p>
        </div>
      </div>

      {/* Bottom info */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-[10px] text-slate-300">ID: {certId}</p>
        <p className="text-[10px] text-slate-300">lingify.uz · O'zbekistondagi ingliz tili platformasi</p>
      </div>

      {/* Bottom border */}
      <div className={`mt-4 h-1 w-full rounded-full bg-gradient-to-r ${type.color} opacity-60`} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
function CertificatePage() {
  const navigate  = useNavigate()
  const { user }  = useUser()
  const { getCompletedCount, getTotalXP } = useLessonProgress()
  const { totalWords } = { totalWords: 500 }
  const testResults = getTestResults()

  const [selectedType, setSelectedType] = useState('level')
  const [downloaded,   setDownloaded]   = useState(false)

  const certType = CERT_TYPES.find((t) => t.id === selectedType) || CERT_TYPES[0]

  const bestResult = testResults.length
    ? testResults.reduce((b, r) => (!b || (r.band || 0) > (b.band || 0) ? r : b), null)
    : null

  const stats = {
    completedLessons: getCompletedCount(),
    totalXP:          getTotalXP(),
    totalWords:       500,
    totalTests:       testResults.length,
    bestBand:         bestResult?.band ?? null,
  }

  function handlePrint() {
    window.print()
  }

  function handleDownload() {
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2000)
    // In production: use html2canvas + jsPDF
    alert('Premium versiyada PDF yuklab olish mumkin! Hozircha Ctrl+P orqali print qiling.')
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: `Lingify Sertifikat - ${certType.title}`,
        text: `Men Lingify da ingliz tilini o'rgandim va ${certType.title} oldim!`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard?.writeText(window.location.href)
      alert('Havola nusxalandi!')
    }
  }

  const isPremiumType = certType.premium

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar />

        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Sertifikatlar 🏅</h1>
              <p className="mt-1 text-sm text-slate-500">
                Yutuqlaringizni rasmiy sertifikat bilan tasdiqlang va ulashing
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                <Printer size={13} />Chop etish
              </button>
              <button onClick={handleShare}
                className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition">
                <Share2 size={13} />Ulashish
              </button>
              <button onClick={handleDownload}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                  downloaded ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-md hover:shadow-lg'
                }`}>
                <Download size={13} />
                {downloaded ? 'Yuklandi ✓' : 'PDF Yuklash'}
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
            {/* Left: type selector */}
            <aside className="space-y-3">
              <h3 className="text-sm font-black text-slate-700">Sertifikat turi</h3>
              {CERT_TYPES.map((type) => (
                <motion.button key={type.id} whileHover={{ x: 2 }}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
                    selectedType === type.id
                      ? `border-transparent bg-gradient-to-r ${type.color} text-white shadow-lg`
                      : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/40'
                  }`}>
                  <span className="text-2xl mt-0.5">{type.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-bold ${selectedType === type.id ? 'text-white' : 'text-slate-900'}`}>
                        {type.title}
                      </p>
                      {type.premium && (
                        <Crown size={12} className={selectedType === type.id ? 'text-yellow-300' : 'text-amber-500'} />
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 leading-5 ${selectedType === type.id ? 'text-white/80' : 'text-slate-500'}`}>
                      {type.desc}
                    </p>
                  </div>
                  <ChevronRight size={16} className={`shrink-0 mt-1 ${selectedType === type.id ? 'text-white/60' : 'text-slate-300'}`} />
                </motion.button>
              ))}

              {/* Stats preview */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                  Sizning natijalaringiz
                </h4>
                <div className="space-y-2 text-sm">
                  {[
                    { icon: BookOpen,  label: 'Tugatilgan darslar', value: stats.completedLessons },
                    { icon: Trophy,    label: 'Mock testlar',        value: stats.totalTests },
                    { icon: Star,      label: 'Jami XP',             value: stats.totalXP.toLocaleString() },
                    { icon: Award,     label: 'Eng yuqori band',     value: stats.bestBand || '—' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs text-slate-600">
                        <Icon size={12} className="text-indigo-400" />{label}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right: certificate preview */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-700">Ko'rinishi</h3>
                <div className="flex gap-1.5">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    ✓ Rasmiy format
                  </span>
                  <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
                    🖨️ Print tayyor
                  </span>
                </div>
              </div>

              <motion.div
                key={selectedType}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CertificateView type={certType} user={user} stats={stats} />
              </motion.div>

              {/* Actions */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                <button onClick={handlePrint}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition shadow-sm">
                  <Printer size={20} className="text-slate-400" />
                  <span className="text-xs font-semibold">Chop etish</span>
                </button>
                <button onClick={handleDownload}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-indigo-700 hover:bg-indigo-100 transition shadow-sm">
                  <Download size={20} className="text-indigo-500" />
                  <span className="text-xs font-semibold">PDF yuklash</span>
                </button>
                <button onClick={handleShare}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 hover:bg-emerald-100 transition shadow-sm">
                  <Share2 size={20} className="text-emerald-500" />
                  <span className="text-xs font-semibold">Ulashish</span>
                </button>
              </div>

              {/* Calendar info */}
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                <Calendar size={13} className="text-indigo-400 shrink-0" />
                <span>Sertifikat {new Date().toLocaleDateString('uz-UZ', { year:'numeric', month:'long', day:'numeric' })} sanasida berildi</span>
              </div>
            </div>
          </div>

          <div className="pb-16 xl:pb-0" />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default CertificatePage
