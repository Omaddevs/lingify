import { Bell, Flame } from 'lucide-react'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import AuthButtons from './AuthButtons'
import LoginModal from './LoginModal'
import NotificationPanel from './NotificationPanel'
import SignupModal from './SignupModal'
import UserAvatar from './UserAvatar'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Header({ title = 'Partner', subtitle = '', onRegisterClick }) {
  const { user, profile, logout, registerDemoUser } = useUser()
  const navigate = useNavigate()
  const [authModal, setAuthModal] = useState(null)
  const [isNotificationsOpen, setNotificationsOpen] = useState(false)
  const isAuthenticated = !!user?.isAuthenticated
  const streak = user?.streak ?? 0
  const notificationRef = useRef(null)

  useEffect(() => {
    function handleOutsideClick(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <header className="mb-6 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>

      <div className="flex items-center gap-3">
        <AuthButtons
          isAuthenticated={isAuthenticated}
          onSignIn={() => setAuthModal('login')}
          onSignUp={() => setAuthModal('signup')}
          onGoToApp={() => navigate('/')}
        />

        {/* Streak badge */}
        <div
          aria-label={`${streak}-day streak`}
          className="hidden items-center gap-2 rounded-2xl border border-orange-100 bg-white px-3 py-2 text-sm shadow-sm sm:flex"
        >
          <Flame size={16} className="text-orange-500" aria-hidden="true" />
          <div>
            <p className="font-semibold text-slate-900">{streak}</p>
            <p className="text-xs text-slate-500">Day streak</p>
          </div>
        </div>

        <div className="relative" ref={notificationRef}>
          <motion.button
            type="button"
            aria-label="Open notifications"
            whileHover={{ scale: 1.05 }}
            onClick={() => setNotificationsOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition duration-300 hover:text-indigo-600"
          >
            <Bell size={18} aria-hidden="true" />
          </motion.button>
          <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} />
        </div>

        <UserAvatar
          user={user}
          profile={profile}
          onGuestClick={() => setAuthModal('login')}
          onLogout={logout}
        />
      </div>

      <LoginModal
        isOpen={authModal === 'login'}
        onClose={() => setAuthModal(null)}
        onSwitchToSignup={() => setAuthModal('signup')}
        onSuccess={() => setAuthModal(null)}
      />
      <SignupModal
        isOpen={authModal === 'signup'}
        onClose={() => setAuthModal(null)}
        onSwitchToLogin={() => setAuthModal('login')}
        onSubmit={(payload) => {
          registerDemoUser(payload)
          setAuthModal(null)
          onRegisterClick?.()
        }}
      />
    </header>
  )
}

export default Header
