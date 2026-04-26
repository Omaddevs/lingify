import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'

function PlaceholderPage({ title, activeItem }) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar activeItem={activeItem} />
        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header title={title} />
          <div className="grid min-h-[60vh] place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
            <div className="text-center">
              <p className="text-2xl font-semibold text-slate-800">{title}</p>
              <p className="mt-2 text-sm text-slate-500">This page is ready for next module content.</p>
            </div>
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default PlaceholderPage
