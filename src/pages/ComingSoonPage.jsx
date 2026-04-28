import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import MobileBottomNav from '../components/Cards/MobileBottomNav'

function ComingSoonPage({ title = 'Coming Soon' }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar />

        <main
          id="main-content"
          className="flex min-h-[calc(100vh-40px)] w-full flex-col items-center justify-center rounded-[20px] border border-slate-200 bg-white p-8 shadow-md"
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
            <Construction size={36} className="text-indigo-500" aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-2 max-w-xs text-center text-sm text-slate-500">
            This section is under construction. Check back soon!
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:shadow-sm"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Go back
          </button>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default ComingSoonPage
