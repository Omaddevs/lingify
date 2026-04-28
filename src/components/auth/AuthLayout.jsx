import { motion } from 'framer-motion'
import logo from '../../images/logo2.png'

function AuthLayout({ children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/70 bg-white/90 p-6 shadow-2xl shadow-slate-200 backdrop-blur md:p-8"
      >
        <div className="mb-7 text-center">
          <img src={logo} alt="Lingify" className="mx-auto h-10 w-auto" />
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">Welcome back 👋</h1>
          <p className="mt-1.5 text-sm text-slate-500">Continue your English journey</p>
        </div>

        {children}
      </motion.div>
    </div>
  )
}

export default AuthLayout
