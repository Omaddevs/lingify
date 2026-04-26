import { useState } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'
import Header from '../components/Header'
import HowItWorks from '../components/HowItWorks'
import MatchingCard from '../components/MatchingCard'
import MyChatsPanel from '../components/MyChatsPanel'
import PartnerHero from '../components/PartnerHero'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'

const tabs = ['Find Partner', 'My Chats']

function PartnerPage() {
  const [activeTab, setActiveTab] = useState('Find Partner')
  const [matchState, setMatchState] = useState('idle')

  const handleFindPartner = () => {
    setMatchState('loading')
    setTimeout(() => setMatchState('found'), 2400)
  }

  const handleFindAnother = () => {
    setMatchState('loading')
    setTimeout(() => setMatchState('found'), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar activeItem="Partner" />

        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header title="Partner" />

          <div className="mb-4 flex items-end justify-between border-b border-slate-200">
            <div className="relative flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-3 text-sm font-medium transition duration-300 ${
                    activeTab === tab ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="partner-tab"
                      className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-indigo-600"
                    />
                  )}
                </button>
              ))}
            </div>
            {activeTab === 'Find Partner' ? (
              <button
                type="button"
                className="mb-2 hidden items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-100 md:flex"
              >
                <SlidersHorizontal size={15} />
                Filters
              </button>
            ) : null}
          </div>

          {activeTab === 'Find Partner' ? (
            <div className="space-y-5 pb-16 xl:pb-0">
              <PartnerHero onFindPartner={handleFindPartner} isLoading={matchState === 'loading'} />
              <HowItWorks />
              <MatchingCard state={matchState} onFindAnother={handleFindAnother} />
            </div>
          ) : (
            <div className="pb-16 xl:pb-0">
              <MyChatsPanel />
            </div>
          )}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  )
}

export default PartnerPage
