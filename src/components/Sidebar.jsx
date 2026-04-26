import {
  BookOpenCheck,
  ChartNoAxesColumn,
  FileCheck2,
  Handshake,
  House,
  MessageCircleMore,
  Settings,
  Video,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import logo1 from '../images/logo2.png'

const menuItems = [
  { name: 'Home', icon: House, path: '/' },
  { name: 'Partner', icon: Handshake, path: '/partner' },
  { name: 'Online Lessons', icon: Video, path: '/online-lessons' },
  { name: 'Mock Exam', icon: FileCheck2, path: '/mock-exam' },
  { name: 'Progress', icon: ChartNoAxesColumn, path: '/progress' },
  { name: 'Messages', icon: MessageCircleMore, path: '/messages' },
  { name: 'Vocabulary', icon: BookOpenCheck, path: '/vocabulary' },
  { name: 'Settings', icon: Settings, path: '/settings' },
]

function Sidebar({ activeItem }) {
  return (
    <aside className="sticky top-5 hidden h-[calc(100vh-40px)] w-[250px] flex-col rounded-[20px] border border-slate-100 bg-white p-5 shadow-md xl:flex">
      <div className="mb-8 flex items-center gap-2.5">
        <img src={logo1} alt="Lingify Logo" className="h-10 w-auto" />
      </div>

      <nav className="space-y-2">
        {menuItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${activeItem === name
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-md'
                : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
          >
            <Icon size={17} />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-800">Upgrade to Premium</p>
        <p className="mt-1 text-xs text-slate-500">Unlock all features and unlimited access.</p>
        <button
          type="button"
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-3 py-2 text-sm font-semibold text-white transition duration-300 hover:scale-[1.03] hover:shadow-lg"
        >
          Upgrade Now
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
