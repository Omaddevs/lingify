import { Lock } from 'lucide-react'

function LockedFeatureWrapper({ children, onClick, tooltip = 'Sign up to access', className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={tooltip}
      className={`group relative text-left ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl bg-white/55 backdrop-blur-[1px]" />
      <div className="pointer-events-none absolute right-3 top-3 z-30 inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2 py-1 text-[10px] font-semibold text-white shadow">
        <Lock size={10} />
        Locked
      </div>
      <div className="pointer-events-none opacity-70 blur-[1px] transition group-hover:opacity-80">
        {children}
      </div>
    </button>
  )
}

export default LockedFeatureWrapper
