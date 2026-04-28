import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, LoaderCircle, Lock, Mail, MessageSquare, X } from 'lucide-react'
import { signIn } from '../services/authService'
import { IS_DEMO } from '../lib/supabase'

const FOCUSABLE = 'input:not([disabled]), button:not([disabled]), select, textarea, a[href]'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginModal({ isOpen, onClose, onSwitchToSignup, onSuccess }) {
  const [showPassword, setShowPassword] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [inlineError, setInlineError] = useState('')
  const [loading, setLoading] = useState(false)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const frame = requestAnimationFrame(() => {
      const els = dialogRef.current?.querySelectorAll(FOCUSABLE)
      els?.[0]?.focus()
    })

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const els = Array.from(dialogRef.current?.querySelectorAll(FOCUSABLE) ?? [])
      if (!els.length) return
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      cancelAnimationFrame(frame)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  async function handleSubmit() {
    setInlineError('')
    const nextErrors = {}
    if (!identifier.trim()) nextErrors.identifier = 'Email or phone is required'
    else if (identifier.includes('@') && !EMAIL_RE.test(identifier.trim())) nextErrors.identifier = 'Invalid email format'
    if (!password.trim()) nextErrors.password = 'Password is required'
    else if (password.length < 6) nextErrors.password = 'Minimum 6 characters'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      if (IS_DEMO) throw new Error('Supabase auth is not configured in demo mode')
      await signIn({ email: identifier.trim(), password })
      onSuccess?.()
      onClose()
    } catch (error) {
      setInlineError(error?.message?.toLowerCase().includes('invalid') ? 'Wrong credentials. Please try again.' : error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close login modal"
            className="absolute right-6 top-6 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
              <MessageSquare className="text-white" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Sign in to Lingify</h2>
            <p className="mt-2 text-sm text-slate-500">Continue your English learning journey</p>
          </div>

          <div className="mt-8 space-y-5">
            {inlineError ? <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{inlineError}</p> : null}

            <div className="space-y-1.5">
              <label htmlFor="login-contact" className="text-sm font-semibold text-slate-700">
                Email or Phone
              </label>
              <div className={`flex items-center overflow-hidden rounded-2xl border bg-slate-50 transition-all focus-within:bg-white focus-within:ring-4 ${errors.identifier ? 'border-red-300 focus-within:ring-red-100' : 'border-slate-200 focus-within:border-indigo-400 focus-within:ring-indigo-100'}`}>
                <span className="pl-4 text-slate-400"><Mail size={18} /></span>
                <input
                  id="login-contact"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full bg-transparent px-3 py-3 text-sm text-slate-900 outline-none"
                />
              </div>
              {errors.identifier ? <p className="text-xs text-red-500">{errors.identifier}</p> : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password-modal" className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className={`flex items-center overflow-hidden rounded-2xl border bg-slate-50 transition-all focus-within:bg-white focus-within:ring-4 ${errors.password ? 'border-red-300 focus-within:ring-red-100' : 'border-slate-200 focus-within:border-indigo-400 focus-within:ring-indigo-100'}`}>
                <span className="pl-4 text-slate-400"><Lock size={18} /></span>
                <input
                  id="login-password-modal"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent px-3 py-3 text-sm text-slate-900 outline-none"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="pr-4 text-slate-400 hover:text-indigo-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password ? <p className="text-xs text-red-500">{errors.password}</p> : null}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? <LoaderCircle size={16} className="animate-spin" /> : null}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <p className="text-center text-sm font-medium text-slate-500">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="font-bold text-indigo-600 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default LoginModal
