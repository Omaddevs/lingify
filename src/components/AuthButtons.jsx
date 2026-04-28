import { AnimatePresence, motion } from 'framer-motion'

function AuthButtons({ isAuthenticated, onSignIn, onSignUp, onGoToApp }) {
  return (
    <div className="hidden min-h-10 min-w-[240px] items-center justify-end gap-2 sm:flex">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="guest-auth"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={onSignIn}
              className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Sign In
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onSignUp}
              className="h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-4 text-sm font-bold text-white shadow-md shadow-indigo-100 transition hover:shadow-lg"
            >
              Sign Up
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            key="auth-app"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onGoToApp}
            className="h-10 rounded-xl border border-indigo-200 bg-indigo-50 px-4 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
          >
            Go to App
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AuthButtons
