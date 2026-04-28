import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, User, ChevronDown } from 'lucide-react'
import { signIn, signUp } from '../services/authService'
import { useUser } from '../context/UserContext'
import { IS_DEMO } from '../lib/supabase'
import logo from '../images/logo2.png'

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

function Field({ label, icon: Icon, type = 'text', value, onChange, placeholder, error, right }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      <div
        className={`flex items-center overflow-hidden rounded-2xl border bg-slate-50 transition-all focus-within:bg-white focus-within:ring-4 ${
          error
            ? 'border-red-300 focus-within:border-red-400 focus-within:ring-red-100'
            : 'border-slate-200 focus-within:border-indigo-400 focus-within:ring-indigo-100'
        }`}
      >
        {Icon && (
          <span className="pl-4 text-slate-400">
            <Icon size={17} />
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
        {right}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default function LoginPage() {
  const { user } = useUser()
  const [tab, setTab] = useState('login')  // 'login' | 'register'

  // Login form
  const [loginEmail,    setLoginEmail]    = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPwd,  setShowLoginPwd]  = useState(false)

  // Register form
  const [regName,     setRegName]     = useState('')
  const [regEmail,    setRegEmail]    = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regLevel,    setRegLevel]    = useState('B1')
  const [showRegPwd,  setShowRegPwd]  = useState(false)

  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [apiErr,  setApiErr]  = useState('')
  const [success, setSuccess] = useState('')

  if (user?.isAuthenticated) return <Navigate to="/" replace />

  function validateLogin() {
    const e = {}
    if (!loginEmail.trim())    e.email    = 'Email required'
    if (!loginPassword.trim()) e.password = 'Password required'
    return e
  }

  function validateRegister() {
    const e = {}
    if (!regName.trim())             e.name     = 'Name required'
    if (!regEmail.trim())            e.email    = 'Email required'
    if (!/\S+@\S+\.\S+/.test(regEmail)) e.email = 'Invalid email'
    if (regPassword.length < 6)      e.password = 'Minimum 6 characters'
    return e
  }

  async function handleLogin(e) {
    e.preventDefault()
    setApiErr('')
    const errs = validateLogin()
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    try {
      await signIn({ email: loginEmail, password: loginPassword })
      // UserContext.onAuthStateChange will fire and redirect via ProtectedRoute
    } catch (err) {
      setApiErr(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setApiErr('')
    const errs = validateRegister()
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    try {
      await signUp({ email: regEmail, password: regPassword, name: regName })
      setSuccess('Account created! Check your email to confirm, then log in.')
      setTab('login')
      setLoginEmail(regEmail)
    } catch (err) {
      setApiErr(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <img src={logo} alt="Lingify" className="h-10 w-auto" />
          <p className="text-sm text-slate-500">Your IELTS journey starts here</p>
        </div>

        {/* Demo mode banner */}
        {IS_DEMO && (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <p className="font-semibold">Demo mode</p>
            <p className="mt-0.5 text-xs">Supabase not configured. <a href="/" className="font-semibold underline">Go to the app</a> — auth is bypassed automatically.</p>
          </div>
        )}

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-100">
          {/* Tab bar */}
          <div className="flex border-b border-slate-100">
            {['login', 'register'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setErrors({}); setApiErr(''); setSuccess('') }}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                  tab === t
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div className="p-8">
            {success && (
              <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}
            {apiErr && (
              <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {apiErr}
              </div>
            )}

            <AnimatePresence mode="wait">
              {tab === 'login' ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  <Field
                    label="Email"
                    icon={Mail}
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    error={errors.email}
                  />
                  <Field
                    label="Password"
                    icon={Lock}
                    type={showLoginPwd ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Your password"
                    error={errors.password}
                    right={
                      <button
                        type="button"
                        onClick={() => setShowLoginPwd((v) => !v)}
                        className="pr-4 text-slate-400 hover:text-indigo-600"
                      >
                        {showLoginPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    }
                  />
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {loading ? 'Logging in…' : 'Log In'}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  onSubmit={handleRegister}
                  className="space-y-4"
                >
                  <Field
                    label="Full Name"
                    icon={User}
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Asadbek Yusupov"
                    error={errors.name}
                  />
                  <Field
                    label="Email"
                    icon={Mail}
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@example.com"
                    error={errors.email}
                  />
                  <Field
                    label="Password"
                    icon={Lock}
                    type={showRegPwd ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    error={errors.password}
                    right={
                      <button
                        type="button"
                        onClick={() => setShowRegPwd((v) => !v)}
                        className="pr-4 text-slate-400 hover:text-indigo-600"
                      >
                        {showRegPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    }
                  />
                  {/* Level picker */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Current English Level</label>
                    <div className="relative">
                      <select
                        value={regLevel}
                        onChange={(e) => setRegLevel(e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      >
                        {LEVELS.map((l) => <option key={l}>{l}</option>)}
                      </select>
                      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {loading ? 'Creating account…' : 'Create Account'}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
