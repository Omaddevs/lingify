import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, CheckCircle2, Circle, ExternalLink,
  Globe, Rocket, Server, Settings, Shield, Zap,
} from 'lucide-react'

const CHECKLIST = [
  {
    category: '🔐 Backend & Auth',
    color: 'indigo',
    items: [
      { id:'sb1',  label:'Supabase project yaratildi',            done: false, link:'https://app.supabase.com' },
      { id:'sb2',  label:'supabase/schema.sql ishga tushirildi',   done: false, link:null },
      { id:'sb3',  label:'.env faylida SUPABASE_URL va ANON_KEY',  done: false, link:null },
      { id:'sb4',  label:'Auth email/password va Google OAuth',    done: false, link:'https://app.supabase.com/project/_/auth/providers' },
      { id:'sb5',  label:'RLS policies tekshirildi',               done: false, link:null },
    ],
  },
  {
    category: '💳 To\'lov tizimi',
    color: 'emerald',
    items: [
      { id:'pay1', label:'Payme merchant account',                 done: false, link:'https://payme.uz/business' },
      { id:'pay2', label:'Click merchant account',                 done: false, link:'https://click.uz' },
      { id:'pay3', label:'VITE_PAYME_MERCHANT_ID .env ga qo\'yildi', done: false, link:null },
      { id:'pay4', label:'Test to\'lov muvaffaqiyatli',            done: false, link:null },
    ],
  },
  {
    category: '🚀 Deploy',
    color: 'violet',
    items: [
      { id:'dep1', label:'Vercel account ulandi',                  done: false, link:'https://vercel.com' },
      { id:'dep2', label:'GitHub repo yaratildi va push qilindi',  done: false, link:'https://github.com' },
      { id:'dep3', label:'Vercel secrets sozlandi',                done: false, link:null },
      { id:'dep4', label:'Custom domain (lingify.uz) ulandi',      done: false, link:null },
      { id:'dep5', label:'SSL sertifikat faol',                    done: false, link:null },
      { id:'dep6', label:'Production build xatosiz chiqdi',       done: true,  link:null },
    ],
  },
  {
    category: '📊 Analytics & Monitoring',
    color: 'amber',
    items: [
      { id:'an1',  label:'Google Analytics 4 property yaratildi',  done: false, link:'https://analytics.google.com' },
      { id:'an2',  label:'VITE_GA_MEASUREMENT_ID .env ga',         done: false, link:null },
      { id:'an3',  label:'Sentry xato tracking ulandi',            done: false, link:'https://sentry.io' },
      { id:'an4',  label:'Uptime monitoring (UptimeRobot)',         done: false, link:'https://uptimerobot.com' },
    ],
  },
  {
    category: '🔍 SEO & PWA',
    color: 'sky',
    items: [
      { id:'seo1', label:'index.html meta taglar to\'g\'ri',        done: true,  link:null },
      { id:'seo2', label:'manifest.json faol',                     done: true,  link:null },
      { id:'seo3', label:'service worker ishlaydi',                done: true,  link:null },
      { id:'seo4', label:'robots.txt',                              done: false, link:null },
      { id:'seo5', label:'sitemap.xml',                             done: false, link:null },
      { id:'seo6', label:'Google Search Console',                   done: false, link:'https://search.google.com/search-console' },
    ],
  },
  {
    category: '📱 Mobile & UX',
    color: 'rose',
    items: [
      { id:'mob1', label:'iOS Safari test',                         done: false, link:null },
      { id:'mob2', label:'Android Chrome test',                     done: false, link:null },
      { id:'mob3', label:'PWA install ishlaydi',                    done: true,  link:null },
      { id:'mob4', label:'Offline page ko\'rinadi',                 done: true,  link:null },
      { id:'mob5', label:'404 sahifa ishlaydi',                     done: true,  link:null },
    ],
  },
  {
    category: '✅ Content',
    color: 'teal',
    items: [
      { id:'cnt1', label:'500+ so\'z lug\'at ma\'lumotlari',        done: true,  link:null },
      { id:'cnt2', label:'Cambridge IELTS 11 audio fayllar',        done: true,  link:null },
      { id:'cnt3', label:'15 ta o\'yin ishlaydi',                   done: true,  link:null },
      { id:'cnt4', label:'AI Speaking Practice ishlaydi',           done: true,  link:null },
      { id:'cnt5', label:'Placement test ishlaydi',                 done: true,  link:null },
      { id:'cnt6', label:'Mock exam IELTS ishlaydi',                done: true,  link:null },
    ],
  },
]

const COLOR_MAP = {
  indigo: { dot: 'bg-indigo-500', badge: 'bg-indigo-100 text-indigo-700', bar: 'bg-indigo-500' },
  emerald:{ dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500' },
  violet: { dot: 'bg-violet-500', badge: 'bg-violet-100 text-violet-700', bar: 'bg-violet-500' },
  amber:  { dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500' },
  sky:    { dot: 'bg-sky-500', badge: 'bg-sky-100 text-sky-700', bar: 'bg-sky-500' },
  rose:   { dot: 'bg-rose-500', badge: 'bg-rose-100 text-rose-700', bar: 'bg-rose-500' },
  teal:   { dot: 'bg-teal-500', badge: 'bg-teal-100 text-teal-700', bar: 'bg-teal-500' },
}

function LaunchPage() {
  const navigate = useNavigate()
  const [checks, setChecks] = useState(() => {
    const init = {}
    CHECKLIST.forEach((c) => c.items.forEach((i) => { init[i.id] = i.done }))
    return init
  })

  function toggle(id) {
    setChecks((p) => ({ ...p, [id]: !p[id] }))
  }

  const totalItems = CHECKLIST.reduce((s, c) => s + c.items.length, 0)
  const doneItems  = Object.values(checks).filter(Boolean).length
  const overallPct = Math.round((doneItems / totalItems) * 100)
  const readyToLaunch = overallPct >= 90

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin')}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100 transition">
              <ArrowLeft size={15} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Rocket size={22} className="text-indigo-600" />
                Launch Checklist
              </h1>
              <p className="text-sm text-slate-500">Lingify ni production ga chiqarish uchun tekshirish ro'yxati</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black ${readyToLaunch ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {readyToLaunch ? '🚀 Tayyor!' : `⏳ ${overallPct}%`}
          </div>
        </div>

        {/* Overall progress */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-slate-900">Umumiy tayyorlik</p>
            <p className="text-2xl font-black text-indigo-700">{overallPct}%</p>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <motion.div initial={{ width: 0 }} animate={{ width: `${overallPct}%` }} transition={{ duration: 0.8 }}
              className={`h-full rounded-full ${readyToLaunch ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-indigo-500 to-violet-600'}`} />
          </div>
          <p className="mt-2 text-xs text-slate-400">{doneItems}/{totalItems} ta element bajarildi</p>

          {readyToLaunch && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3">
              <Rocket size={20} className="text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-black text-emerald-800">Platforma launch uchun tayyor!</p>
                <p className="text-xs text-emerald-600">Barcha muhim elementlar bajarildi. Vercel ga deploy qiling.</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Deploy steps */}
        <div className="mb-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
          <h2 className="mb-4 flex items-center gap-2 font-black text-indigo-900">
            <Server size={16} />Deploy qadamlari
          </h2>
          <div className="space-y-2 text-sm text-indigo-800">
            {[
              { step:'1', cmd: 'git add . && git commit -m "feat: Phase 10 complete"', desc: 'Barcha o\'zgarishlarni commit qiling' },
              { step:'2', cmd: 'git push origin main', desc: 'GitHub ga push qiling (CI/CD avtomatik ishga tushadi)' },
              { step:'3', cmd: 'vercel --prod', desc: 'Yoki Vercel dashboard\'dan deploy qiling' },
              { step:'4', cmd: 'cat supabase/schema.sql | supabase db push', desc: 'Supabase schema\'ni deploy qiling' },
            ].map(({ step, cmd, desc }) => (
              <div key={step} className="flex gap-3 rounded-xl bg-white border border-indigo-100 p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-black text-white">{step}</span>
                <div className="min-w-0">
                  <p className="text-[11px] text-indigo-500 mb-0.5">{desc}</p>
                  <code className="block text-[11px] font-mono bg-indigo-50 rounded px-2 py-0.5 text-indigo-800 truncate">{cmd}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist categories */}
        <div className="space-y-4">
          {CHECKLIST.map((cat) => {
            const catDone = cat.items.filter((i) => checks[i.id]).length
            const catPct  = Math.round((catDone / cat.items.length) * 100)
            const colors  = COLOR_MAP[cat.color] || COLOR_MAP.indigo
            return (
              <div key={cat.category} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                {/* Category header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                  <h3 className="font-black text-slate-900">{cat.category}</h3>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${colors.bar} transition-all`} style={{ width:`${catPct}%` }} />
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${colors.badge}`}>
                      {catDone}/{cat.items.length}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-slate-50 px-5">
                  {cat.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-3">
                      <button onClick={() => toggle(item.id)}
                        className="shrink-0 transition hover:scale-110">
                        {checks[item.id]
                          ? <CheckCircle2 size={20} className="text-emerald-500" />
                          : <Circle size={20} className="text-slate-300" />}
                      </button>
                      <p className={`flex-1 text-sm ${checks[item.id] ? 'text-slate-400 line-through' : 'text-slate-800 font-medium'}`}>
                        {item.label}
                      </p>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer"
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-100 hover:text-indigo-500 transition">
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom actions */}
        <div className="mt-6 flex gap-3">
          <button onClick={() => navigate('/admin')}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
            <Settings size={15} />Admin panel
          </button>
          <button onClick={() => window.open('https://vercel.com', '_blank')}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 py-3 text-sm font-black text-white shadow-xl hover:shadow-2xl transition">
            <Globe size={15} />Vercel Dashboard
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Lingify v1.0.0 · Phase 10 · {new Date().toLocaleDateString('uz-UZ')}
        </p>
      </div>
    </div>
  )
}

export default LaunchPage
