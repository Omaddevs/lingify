import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import Header from '../components/Header'
import HowItWorks from '../components/HowItWorks'
import MatchingCard from '../components/MatchingCard'
import PartnerHero from '../components/PartnerHero'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'
import AISpeakingPanel from '../components/AISpeakingPanel'

const tabs = ['Find Partner', 'AI Speaking']
const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const availabilitySlots = ['Morning', 'Afternoon', 'Evening']

function PartnerPage() {
  const [activeTab, setActiveTab] = useState('Find Partner')
  const [matchState, setMatchState] = useState('idle')

  // TASK 3: filter panel state
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    level: '',
    nativeLanguage: '',
    availability: [],
  })

  const handleFindPartner = () => {
    setMatchState('loading')
    setTimeout(() => setMatchState('found'), 2400)
  }

  const handleFindAnother = () => {
    setMatchState('loading')
    setTimeout(() => setMatchState('found'), 2000)
  }

  const toggleAvailability = (slot) =>
    setFilters((prev) => ({
      ...prev,
      availability: prev.availability.includes(slot)
        ? prev.availability.filter((s) => s !== slot)
        : [...prev.availability, slot],
    }))

  const handleApplyFilters = () => setShowFilters(false)

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar />

        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header title="Partner" />

          {/* tab bar */}
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

            {/* TASK 3: Filters button toggles showFilters */}
            {activeTab === 'Find Partner' && (
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className={`mb-2 hidden items-center gap-1 rounded-xl border px-3 py-1.5 text-sm transition md:flex ${
                  showFilters
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <SlidersHorizontal size={15} />
                Filters
                {showFilters && <X size={13} className="ml-0.5" />}
              </button>
            )}
          </div>

          {/* TASK 3: collapsible filter panel */}
          <AnimatePresence>
            {activeTab === 'Find Partner' && showFilters && (
              <motion.div
                key="filters"
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
              >
                <p className="mb-4 text-sm font-semibold text-slate-700">Filter partners</p>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Language level */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Language Level
                    </label>
                    <select
                      value={filters.level}
                      onChange={(e) => setFilters((p) => ({ ...p, level: e.target.value }))}
                      className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="">Any level</option>
                      {levels.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>

                  {/* Native language */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Native Language
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Uzbek, Russian…"
                      value={filters.nativeLanguage}
                      onChange={(e) => setFilters((p) => ({ ...p, nativeLanguage: e.target.value }))}
                      className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  {/* Availability checkboxes */}
                  <div>
                    <p className="mb-1.5 text-xs font-semibold text-slate-600">Availability</p>
                    <div className="flex flex-wrap gap-2">
                      {availabilitySlots.map((slot) => {
                        const checked = filters.availability.includes(slot)
                        return (
                          <label
                            key={slot}
                            className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                              checked
                                ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleAvailability(slot)}
                              className="sr-only"
                            />
                            {slot}
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFilters({ level: '', nativeLanguage: '', availability: [] })
                    }}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyFilters}
                    className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === 'Find Partner' ? (
            <div className="space-y-5 pb-16 xl:pb-0">
              <PartnerHero onFindPartner={handleFindPartner} isLoading={matchState === 'loading'} />
              <HowItWorks />
              <MatchingCard state={matchState} onFindAnother={handleFindAnother} />
            </div>
          ) : (
            <div className="pb-16 xl:pb-0">
              <AISpeakingPanel />
            </div>
          )}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  )
}

export default PartnerPage
