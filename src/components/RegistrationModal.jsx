import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Eye, EyeOff, GraduationCap, Lock, Mail, MessageSquare, Presentation, User, X } from 'lucide-react'

const FOCUSABLE = 'input:not([disabled]), button:not([disabled]), select, textarea, a[href]'

const roles = [
  { id: 'student', title: 'Student', icon: GraduationCap },
  { id: 'teacher', title: 'Teacher', icon: Presentation },
]

function RegistrationModal({ isOpen, onClose, onSubmit, onSwitchToLogin }) {
  const [selectedRole, setSelectedRole] = useState('student')
  const [showPassword, setShowPassword] = useState(false)
  const [name,         setName]         = useState('')
  const [contact,      setContact]      = useState('')
  const [password,     setPassword]     = useState('')

  const dialogRef = useRef(null)

  // ── Focus trap + Escape close ────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return

    // Focus the first focusable element on mount
    const frame = requestAnimationFrame(() => {
      const els = dialogRef.current?.querySelectorAll(FOCUSABLE)
      els?.[0]?.focus()
    })

    function onKeyDown(e) {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return

      const els = Array.from(dialogRef.current?.querySelectorAll(FOCUSABLE) ?? [])
      if (!els.length) return
      const first = els[0]
      const last  = els[els.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      cancelAnimationFrame(frame)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        aria-hidden="true"
      >
        {/* Dialog */}
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close registration modal"
            className="absolute right-6 top-6 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} aria-hidden="true" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
              <MessageSquare className="text-white" size={28} aria-hidden="true" />
            </div>
            <h2 id="modal-title" className="text-2xl font-bold text-slate-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Join Lingify and start your English learning journey
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {/* Role Selection */}
            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-slate-700">
                I am registering as
              </legend>
              <div className="grid grid-cols-2 gap-4">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    aria-pressed={selectedRole === role.id}
                    className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all duration-300 ${
                      selectedRole === role.id
                        ? 'border-indigo-600 bg-indigo-50/50'
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                        selectedRole === role.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}
                    >
                      <role.icon size={24} aria-hidden="true" />
                    </div>
                    <span className={`text-sm font-semibold ${selectedRole === role.id ? 'text-indigo-600' : 'text-slate-600'}`}>
                      {role.title}
                    </span>
                    {selectedRole === role.id && (
                      <span className="absolute right-2 top-2 rounded-full bg-indigo-600 p-0.5 text-white ring-4 ring-indigo-50">
                        <CheckCircle2 size={12} fill="currentColor" aria-hidden="true" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="modal-name" className="text-sm font-semibold text-slate-700">
                Full name
              </label>
              <div className="flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition-all focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
                <span className="pl-4 text-slate-400" aria-hidden="true">
                  <User size={18} />
                </span>
                <input
                  id="modal-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Asadbek Yusupov"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent px-3 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Phone or Email */}
            <div className="space-y-2">
              <label htmlFor="modal-contact" className="text-sm font-semibold text-slate-700">
                Phone or email
              </label>
              <div className="flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition-all focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
                <span className="pl-4 text-slate-400" aria-hidden="true">
                  <Mail size={18} />
                </span>
                <input
                  id="modal-contact"
                  type="text"
                  autoComplete="email"
                  placeholder="+998 90 123 45 67 or you@email.com"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full bg-transparent px-3 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="modal-password" className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition-all focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
                <span className="pl-4 text-slate-400" aria-hidden="true">
                  <Lock size={18} />
                </span>
                <input
                  id="modal-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent px-3 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="pr-4 text-slate-400 transition hover:text-indigo-600"
                >
                  {showPassword
                    ? <EyeOff size={18} aria-hidden="true" />
                    : <Eye     size={18} aria-hidden="true" />}
                </button>
              </div>
              <p className="flex items-center gap-2 px-1 text-xs text-slate-400">
                <CheckCircle2
                  size={12}
                  aria-hidden="true"
                  className={password.length >= 6 ? 'text-emerald-500' : 'text-slate-300'}
                />
                Password must be at least 6 characters
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onSubmit?.({ name, contact, password, role: selectedRole })}
                className="w-full rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition duration-300 hover:bg-indigo-700"
              >
                Create Account
              </motion.button>
              <p className="text-center text-sm font-medium text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  className="font-bold text-indigo-600 hover:underline"
                  onClick={onSwitchToLogin || onClose}
                >
                  Log in
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default RegistrationModal
