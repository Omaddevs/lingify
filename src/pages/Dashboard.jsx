import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import BottomPanels from '../components/Cards/BottomPanels'
import LearningModules from '../components/Cards/LearningModules'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import OverviewCards from '../components/Cards/OverviewCards'
import PartnerLessonSection from '../components/Cards/PartnerLessonSection'

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar activeItem="Home" />

        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header
            title="Welcome back, Asadbek!"
            subtitle="Let's continue your journey to achieve your target score."
          />
          <div className="space-y-4 pb-20 xl:pb-0">
            <OverviewCards />
            <PartnerLessonSection />
            <LearningModules />
            <BottomPanels />
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  )
}

export default Dashboard
