import { BookOpenCheck, FileCheck2, House, Trophy, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Bosh',      icon: House,          path: '/' },
  { label: 'Darslar',   icon: BookOpenCheck,  path: '/online-lessons' },
  { label: 'Test',      icon: FileCheck2,     path: '/mock-exam' },
  { label: 'Reyting',   icon: Trophy,         path: '/leaderboard' },
  { label: 'Profil',    icon: UserRound,      path: '/settings' },
]

function MobileBottomNav({ locked = false, onLockedClick }) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-4 bottom-4 z-50 rounded-2xl border border-white/80 bg-white/95 p-2 shadow-card backdrop-blur xl:hidden"
    >
      <ul className="grid grid-cols-5 gap-1" role="list">
        {navItems.map(({ label, icon: Icon, path }) => (
          <li key={label}>
            {locked ? (
              <button
                type="button"
                title="Sign up to access"
                onClick={onLockedClick}
                className="flex w-full flex-col items-center gap-1 rounded-lg py-2 text-[11px] font-medium text-slate-400"
              >
                <Icon size={16} aria-hidden="true" />
                <span>{label}</span>
              </button>
            ) : (
              <NavLink
                to={path}
                end={path === '/'}
                aria-label={label}
                className={({ isActive }) =>
                  `flex w-full flex-col items-center gap-1 rounded-lg py-2 text-[11px] font-medium transition ${
                    isActive ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-indigo-600'
                  }`
                }
              >
                <Icon size={16} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MobileBottomNav
