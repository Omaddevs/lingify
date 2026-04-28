import { useMemo, useState } from 'react'
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Crown,
  Filter,
  Play,
  Search,
  ShoppingCart,
  Star,
  Trophy,
  Users,
  Video,
  X,
} from 'lucide-react'
import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'
import { PremiumModal, usePremium } from '../components/PremiumModal'

const CATEGORIES = ['Hammasi', 'IELTS', 'TOEFL', 'SAT', 'Speaking', 'Grammar', 'Writing', 'Beginner']
const LEVELS = ['Hammasi', 'A1', 'A2', 'B1', 'B2', 'C1']

const COURSES = [
  {
    id: 'c1',
    title: 'IELTS 7.0+ Masterclass',
    teacher: { name: 'Jasur Karimov', avatar: null, rating: 4.9, students: 1240, verified: true },
    category: 'IELTS',
    level: 'B2',
    price: 299000,
    currency: 'UZS',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80',
    lessons: 48,
    duration: '24 soat',
    rating: 4.9,
    reviews: 328,
    enrolled: 1240,
    description: 'IELTS Academic 7.0 va undan yuqori ball olish uchun to\'liq kurs. Barcha 4 bo\'lim qamrab olingan.',
    tags: ['IELTS', 'Academic', 'Band 7+'],
    bestseller: true,
    free: false,
    preview: true,
  },
  {
    id: 'c2',
    title: 'Ingliz tilini 0 dan B1 gacha',
    teacher: { name: 'Malika Toshmatova', avatar: null, rating: 4.8, students: 3420, verified: true },
    category: 'Beginner',
    level: 'A1',
    price: 199000,
    currency: 'UZS',
    thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&q=80',
    lessons: 72,
    duration: '36 soat',
    rating: 4.8,
    reviews: 892,
    enrolled: 3420,
    description: 'Mutlaq boshlang\'ichlar uchun. O\'zbek tilida tushuntiriladi. A0 dan B1 gacha olib boradi.',
    tags: ['Beginner', 'O\'zbek tilida', 'Grammar'],
    bestseller: true,
    free: false,
    preview: true,
  },
  {
    id: 'c3',
    title: 'IELTS Speaking — Band 8 Strategy',
    teacher: { name: 'Bobur Rashidov', avatar: null, rating: 4.7, students: 890, verified: true },
    category: 'Speaking',
    level: 'B1',
    price: 149000,
    currency: 'UZS',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&q=80',
    lessons: 24,
    duration: '12 soat',
    rating: 4.7,
    reviews: 215,
    enrolled: 890,
    description: 'IELTS Speaking band 8 olish strategiyalari. Part 1, 2, 3 uchun alohida techniques.',
    tags: ['Speaking', 'Band 8', 'IELTS'],
    bestseller: false,
    free: false,
    preview: true,
  },
  {
    id: 'c4',
    title: 'TOEFL iBT Complete Preparation',
    teacher: { name: 'Nilufar Xasanova', avatar: null, rating: 4.6, students: 567, verified: true },
    category: 'TOEFL',
    level: 'B2',
    price: 349000,
    currency: 'UZS',
    thumbnail: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=500&q=80',
    lessons: 60,
    duration: '30 soat',
    rating: 4.6,
    reviews: 134,
    enrolled: 567,
    description: 'TOEFL iBT 100+ ball uchun to\'liq tayyorlov kursi. Reading, Listening, Speaking, Writing.',
    tags: ['TOEFL', 'iBT', '100+'],
    bestseller: false,
    free: false,
    preview: false,
  },
  {
    id: 'c5',
    title: 'English Grammar A-Z',
    teacher: { name: 'Kamol Umarov', avatar: null, rating: 4.5, students: 2100, verified: false },
    category: 'Grammar',
    level: 'A2',
    price: 0,
    currency: 'UZS',
    thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80',
    lessons: 30,
    duration: '15 soat',
    rating: 4.5,
    reviews: 440,
    enrolled: 2100,
    description: 'Grammatikaning asosiy qoidalarini o\'zbek tilida, misollar bilan tushuntirish.',
    tags: ['Grammar', 'A2', 'Bepul'],
    bestseller: false,
    free: true,
    preview: true,
  },
  {
    id: 'c6',
    title: 'SAT Math — Full Preparation',
    teacher: { name: 'Sherzod Mirzayev', avatar: null, rating: 4.8, students: 340, verified: true },
    category: 'SAT',
    level: 'B1',
    price: 279000,
    currency: 'UZS',
    thumbnail: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=500&q=80',
    lessons: 40,
    duration: '20 soat',
    rating: 4.8,
    reviews: 89,
    enrolled: 340,
    description: 'SAT Math 700+ uchun. Algebra, Geometry, Data Analysis. No Calculator & Calculator sections.',
    tags: ['SAT', 'Math', '700+'],
    bestseller: false,
    free: false,
    preview: true,
  },
  {
    id: 'c7',
    title: 'IELTS Writing — Task 1 & Task 2',
    teacher: { name: 'Feruza Nazarova', avatar: null, rating: 4.9, students: 780, verified: true },
    category: 'Writing',
    level: 'B1',
    price: 199000,
    currency: 'UZS',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&q=80',
    lessons: 32,
    duration: '16 soat',
    rating: 4.9,
    reviews: 198,
    enrolled: 780,
    description: 'IELTS Academic Writing Task 1 (graphs, charts, maps) va Task 2 (essays) uchun maxsus strategiyalar.',
    tags: ['IELTS', 'Writing', 'Band 7+'],
    bestseller: true,
    free: false,
    preview: true,
  },
  {
    id: 'c8',
    title: 'Business English Essentials',
    teacher: { name: 'Dilshod Yusupov', avatar: null, rating: 4.4, students: 920, verified: true },
    category: 'Grammar',
    level: 'B2',
    price: 249000,
    currency: 'UZS',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500&q=80',
    lessons: 36,
    duration: '18 soat',
    rating: 4.4,
    reviews: 156,
    enrolled: 920,
    description: 'Ish muhitida ingliz tilida muloqot: emails, presentations, negotiations, meetings.',
    tags: ['Business', 'Professional', 'B2'],
    bestseller: false,
    free: false,
    preview: false,
  },
]

const LEVEL_COLORS = {
  A1: 'bg-emerald-100 text-emerald-700',
  A2: 'bg-sky-100 text-sky-700',
  B1: 'bg-indigo-100 text-indigo-700',
  B2: 'bg-violet-100 text-violet-700',
  C1: 'bg-amber-100 text-amber-700',
}

function TeacherAvatar({ name, size = 36 }) {
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full text-white font-semibold"
      style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}
    >
      {name[0]}
    </div>
  )
}

// ── Course Detail Modal ──────────────────────────────────────────────────────
function CourseModal({ course, onClose, onBuy, enrolled }) {
  if (!course) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
          >
            <X size={15} />
          </button>
          {course.bestseller && (
            <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-white">
              🏆 Bestseller
            </span>
          )}
          <div className="absolute bottom-4 left-4">
            <h2 className="text-xl font-bold text-white">{course.title}</h2>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-[1fr_220px]">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {course.tags.map((t) => (
                <span key={t} className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                  {t}
                </span>
              ))}
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEVEL_COLORS[course.level] || 'bg-slate-100 text-slate-600'}`}>
                {course.level}
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-6">{course.description}</p>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
              {[
                { label: 'Darslar', value: `${course.lessons} ta` },
                { label: 'Davomiyligi', value: course.duration },
                { label: 'Talabalar', value: `${course.enrolled.toLocaleString()} ta` },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-slate-50 p-2.5">
                  <p className="font-bold text-slate-900">{value}</p>
                  <p className="text-slate-400">{label}</p>
                </div>
              ))}
            </div>

            {/* Teacher */}
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 p-3">
              <TeacherAvatar name={course.teacher.name} size={40} />
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-slate-800">{course.teacher.name}</p>
                  {course.teacher.verified && (
                    <CheckCircle2 size={13} className="text-indigo-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Star size={11} className="text-amber-400" fill="currentColor" />
                  {course.teacher.rating} · {course.teacher.students.toLocaleString()} ta talaba
                </div>
              </div>
            </div>
          </div>

          {/* Purchase panel */}
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border border-slate-200 p-4 text-center">
              {course.free ? (
                <p className="text-2xl font-black text-emerald-600">Bepul</p>
              ) : (
                <>
                  <p className="text-2xl font-black text-slate-900">
                    {course.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400">UZS</p>
                </>
              )}

              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-amber-600">
                <Star size={11} fill="currentColor" />
                <span className="font-semibold">{course.rating}</span>
                <span className="text-slate-400">({course.reviews} ta sharh)</span>
              </div>
            </div>

            {enrolled ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
                <CheckCircle2 size={20} className="mx-auto mb-1 text-emerald-500" />
                <p className="text-sm font-semibold text-emerald-700">Xarid qilingan</p>
                <button className="mt-2 w-full rounded-lg bg-emerald-500 py-2 text-xs font-bold text-white">
                  Kursni boshlash →
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onBuy(course)}
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg"
                >
                  {course.free ? 'Bepul boshlash' : (
                    <span className="flex items-center justify-center gap-1.5">
                      <ShoppingCart size={14} />
                      Sotib olish
                    </span>
                  )}
                </button>
                {course.preview && (
                  <button className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <span className="flex items-center justify-center gap-1.5">
                      <Play size={13} />
                      Bepul preview
                    </span>
                  </button>
                )}
              </>
            )}

            <p className="text-center text-[11px] text-slate-400">
              30 kunlik qaytarish kafolati
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

import { motion } from 'framer-motion'

function CourseCard({ course, onClick, enrolled }) {
  return (
    <motion.article
      whileHover={{ y: -3 }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {course.free && (
          <span className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-bold text-white">
            Bepul
          </span>
        )}
        {course.bestseller && !course.free && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-white">
            🏆 Bestseller
          </span>
        )}
        {enrolled && (
          <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500">
            <CheckCircle2 size={14} className="text-white" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2 flex gap-1.5">
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600">
            {course.category}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${LEVEL_COLORS[course.level] || 'bg-slate-100 text-slate-600'}`}>
            {course.level}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-indigo-700">
          {course.title}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <TeacherAvatar name={course.teacher.name} size={22} />
          <p className="truncate text-xs text-slate-500">{course.teacher.name}</p>
          {course.teacher.verified && <CheckCircle2 size={11} className="shrink-0 text-indigo-400" />}
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-0.5 text-amber-500">
            <Star size={11} fill="currentColor" />
            {course.rating}
          </span>
          <span>({course.reviews})</span>
          <span>·</span>
          <span>{course.lessons} dars</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          {course.free ? (
            <span className="text-base font-black text-emerald-600">Bepul</span>
          ) : (
            <span className="text-base font-black text-slate-900">
              {course.price.toLocaleString()} <span className="text-xs font-normal text-slate-400">UZS</span>
            </span>
          )}
          <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500" />
        </div>
      </div>
    </motion.article>
  )
}

function TeacherMarketplace() {
  const [activeCategory, setActiveCategory] = useState('Hammasi')
  const [activeLevel, setActiveLevel] = useState('Hammasi')
  const [search, setSearch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [enrolledIds, setEnrolledIds] = useState(['c5'])
  const { isOpen: premiumOpen, featureName, openPremium, closePremium } = usePremium()

  const filtered = useMemo(() => {
    let courses = COURSES
    if (activeCategory !== 'Hammasi') courses = courses.filter((c) => c.category === activeCategory)
    if (activeLevel !== 'Hammasi') courses = courses.filter((c) => c.level === activeLevel)
    if (search) {
      const q = search.toLowerCase()
      courses = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.teacher.name.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }
    return courses
  }, [activeCategory, activeLevel, search])

  function handleBuy(course) {
    if (course.free) {
      setEnrolledIds((prev) => [...prev, course.id])
      setSelectedCourse(null)
      return
    }
    openPremium(course.title)
  }

  const stats = [
    { icon: Video,  label: 'Jami kurslar', value: COURSES.length },
    { icon: Users,  label: 'O\'qituvchilar', value: 12 },
    { icon: BookOpen, label: 'Darslar', value: '340+' },
    { icon: Trophy, label: 'Muvaffaqiyatli', value: '5 200+' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onBuy={handleBuy}
          enrolled={enrolledIds.includes(selectedCourse.id)}
        />
      )}
      <PremiumModal isOpen={premiumOpen} onClose={closePremium} featureName={featureName} />

      <div className="flex w-full gap-5">
        <Sidebar />

        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header title="O'qituvchilar" subtitle="Professional o'qituvchilardan kurslar xarid qiling" />

          {/* Stats */}
          <div className="mb-5 grid gap-3 sm:grid-cols-4">
            {stats.map(({ icon: Icon, label, value }) => (
              <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-slate-400">
                  <Icon size={14} />
                  <p className="text-xs">{label}</p>
                </div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
              </article>
            ))}
          </div>

          {/* Enrolled courses (if any) */}
          {enrolledIds.length > 0 && (
            <section className="mb-5">
              <h3 className="mb-3 text-lg font-semibold text-slate-900">Xarid qilingan kurslar</h3>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {COURSES.filter((c) => enrolledIds.includes(c.id)).map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={() => setSelectedCourse(course)}
                    enrolled
                  />
                ))}
              </div>
            </section>
          )}

          {/* Hero banner */}
          <section className="mb-5 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-5">
            <div className="grid items-center gap-4 md:grid-cols-[1fr_200px]">
              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                  <Crown size={11} />
                  Professional o'qituvchilar
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Eng yaxshi ingliz tili o'qituvchilaridan o'rganing
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  IELTS, TOEFL, SAT va General English bo'yicha sertifikatlangan o'qituvchilar
                </p>
                <button className="mt-4 rounded-xl border border-indigo-300 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100">
                  O'qituvchi bo'lish →
                </button>
              </div>
              <div className="hidden md:block text-right text-6xl">🎓</div>
            </div>
          </section>

          {/* Filters */}
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Kurs qidirish..."
                  className="h-9 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs outline-none focus:border-indigo-300"
                />
              </div>
              <div className="flex gap-1">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setActiveLevel(l)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                      activeLevel === l ? 'bg-indigo-600 text-white' : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Course grid */}
          <section className="pb-16 xl:pb-0">
            <p className="mb-3 text-xs text-slate-400">{filtered.length} ta kurs topildi</p>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center text-slate-400">
                <BookOpen size={40} className="mb-3 opacity-30" />
                <p>Kurs topilmadi</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {filtered.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={() => setSelectedCourse(course)}
                    enrolled={enrolledIds.includes(course.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default TeacherMarketplace
