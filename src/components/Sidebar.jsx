import {
  BookOpenCheck, ChartNoAxesColumn, FileCheck2, Handshake,
  House, MessageCircleMore, Settings, Video,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import logo1 from '../images/logo2.png'

const menuItems = [
  { name: 'Home',          icon: House,            path: '/' },
  { name: 'Partner',       icon: Handshake,        path: '/partner' },
  { name: 'Online Lessons', icon: Video,           path: '/online-lessons' },
  { name: 'Mock Exam',     icon: FileCheck2,       path: '/mock-exam' },
  { name: 'Progress',      icon: ChartNoAxesColumn, path: '/progress' },
  { name: 'Messages',      icon: MessageCircleMore, path: '/messages' },
  { name: 'Vocabulary',    icon: BookOpenCheck,    path: '/vocabulary' },
  { name: 'Settings',      icon: Settings,         path: '/settings' },
]

function Sidebar() {
  return (
    <aside
      aria-label="Main navigation"
      className="sticky top-5 hidden h-[calc(100vh-40px)] w-[250px] flex-col rounded-[20px] border border-slate-100 bg-white p-5 shadow-md xl:flex"
    >
      <div className="mb-8 flex items-center gap-2.5">
        <img src={logo1} alt="Lingify — go to home page" className="h-10 w-auto" />
      </div>

      <nav aria-label="Site pages">
        <ul className="space-y-2">
          {menuItems.map(({ name, icon: Icon, path }) => (
            <li key={name}>
              <NavLink
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-md'
                      : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                  }`
                }
              >
                <Icon size={17} aria-hidden="true" />
                <span>{name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto rounded-2xl bg-slate-100/70 p-4 text-center">
        <div className="mb-3 flex justify-center" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 24L7.5 12L13 18L16 8L19 18L24.5 12L28 24H4Z" fill="#6366f1" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round"/>
            <rect x="4" y="24" width="24" height="3" rx="1.5" fill="#6366f1"/>
          </svg>
        </div>
        <p className="text-sm font-bold text-slate-900">Upgrade to Premium</p>
        <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">Unlock all features and get unlimited access.</p>
        <button
          type="button"
          className="mt-4 w-full rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-bold text-white transition duration-300 hover:bg-indigo-700 hover:shadow-lg active:scale-95"
        >
          Upgrade Now
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
