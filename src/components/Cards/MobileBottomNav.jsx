import { FileCheck2, Handshake, House, UserRound, Video } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home',    icon: House,      path: '/' },
  { label: 'Partner', icon: Handshake,  path: '/partner' },
  { label: 'Lessons', icon: Video,      path: '/online-lessons' },
  { label: 'Mock',    icon: FileCheck2, path: '/mock-exam' },
  { label: 'Profile', icon: UserRound,  path: '/settings' },
]

function MobileBottomNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-4 bottom-4 z-50 rounded-2xl border border-white/80 bg-white/95 p-2 shadow-card backdrop-blur xl:hidden"
    >
      <ul className="grid grid-cols-5 gap-1" role="list">
        {navItems.map(({ label, icon: Icon, path }) => (
          <li key={label}>
            <NavLink
              to={path}
              end={path === '/'}
              aria-label={label}
              className={({ isActive }) =>
                `flex w-full flex-col items-center gap-1 rounded-lg py-2 text-[11px] font-medium transition ${
                  isActive ? 'bg-indigo-100 text-primary' : 'text-slate-500 hover:text-indigo-600'
                }`
              }
            >
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MobileBottomNav
