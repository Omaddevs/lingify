import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LoaderCircle, Mail } from 'lucide-react'
import { getSession, signIn } from '../../services/authService'
import InputField from './InputField'
import PasswordField from './PasswordField'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginForm({ onSuccess, isDemo }) {
  const [identifier, setIdentifier] = useState(() => localStorage.getItem('lingify_last_email') || '')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [inlineError, setInlineError] = useState('')
  const [toast, setToast] = useState('')
  const [shake, setShake] = useState(false)
  const [success, setSuccess] = useState(false)

  const canSubmit = useMemo(
    () => EMAIL_RE.test(identifier.trim()) && password.trim().length >= 6 && !loading,
    [identifier, password, loading],
  )

  useEffect(() => {
    const nextErrors = {}
    if (identifier && !EMAIL_RE.test(identifier.trim())) {
      nextErrors.identifier = 'Enter a valid email format'
    }
    if (password && password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters'
    }
    setErrors(nextErrors)
  }, [identifier, password])

  function handleNetworkError(err) {
    const message = err?.message || 'Network error'
    const lower = message.toLowerCase()
    if (lower.includes('network') || lower.includes('fetch') || lower.includes('offline')) {
      setToast('Network error. Please check your connection and try again.')
      setTimeout(() => setToast(''), 2500)
      return true
    }
    return false
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setInlineError('')

    const nextErrors = {}
    if (!identifier.trim()) nextErrors.identifier = 'Email is required'
    else if (!EMAIL_RE.test(identifier.trim())) nextErrors.identifier = 'Enter a valid email format'
    if (!password.trim()) nextErrors.password = 'Password is required'
    else if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setShake(true)
      setTimeout(() => setShake(false), 300)
      return
    }

    setLoading(true)
    try {
      await signIn({ email: identifier.trim(), password })
      const session = await getSession()
      if (!session?.user) throw new Error('Could not establish session after sign in')

      if (rememberMe) localStorage.setItem('lingify_last_email', identifier.trim())
      else localStorage.removeItem('lingify_last_email')

      setSuccess(true)
      setTimeout(() => onSuccess?.(), 250)
    } catch (err) {
      if (!handleNetworkError(err)) {
        setInlineError('Wrong email or password. Please try again.')
      }
      setShake(true)
      setTimeout(() => setShake(false), 300)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      animate={shake ? { x: [-8, 8, -6, 6, 0] } : { x: 0, scale: success ? 0.99 : 1, opacity: success ? 0.85 : 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      {isDemo ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Supabase not configured. Sign-in works after `.env` setup.
        </div>
      ) : null}

      {inlineError ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{inlineError}</p> : null}

      <InputField
        id="login-identifier"
        label="Email or Phone"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        placeholder="you@email.com"
        icon={Mail}
        autoComplete="email"
        error={errors.identifier}
      />

      <PasswordField
        id="login-password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Your password"
        error={errors.password}
      />

      <div className="flex items-center justify-between">
        <label className="inline-flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
          />
          Remember me
        </label>
        <button type="button" className="text-sm font-medium text-indigo-600 hover:underline">
          Forgot password?
        </button>
      </div>

      <motion.button
        whileHover={{ scale: canSubmit ? 1.01 : 1 }}
        whileTap={{ scale: canSubmit ? 0.99 : 1 }}
        type="submit"
        disabled={!canSubmit}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-700 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <LoaderCircle className="animate-spin" size={17} /> : null}
        {loading ? 'Signing In...' : 'Sign In'}
      </motion.button>

      <div className="relative py-1 text-center text-xs text-slate-400">
        <span className="relative z-10 bg-white px-2">OR</span>
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-slate-200" />
      </div>

      <button
        type="button"
        className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Continue with Google
      </button>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link to="/" className="font-semibold text-indigo-600 hover:underline">
          Sign up
        </Link>
      </p>

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-xl bg-slate-900 px-3 py-2 text-xs text-white"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.form>
  )
}

export default LoginForm
