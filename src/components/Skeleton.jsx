// ─────────────────────────────────────────────────────────────────────────────
//  Skeleton loading components — used across pages while data loads
// ─────────────────────────────────────────────────────────────────────────────
function Shimmer({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] ${className}`}
      style={{ animation: 'shimmer 1.5s infinite', backgroundSize: '200% 100%' }}
    />
  )
}

// ── Card skeleton ─────────────────────────────────────────────────────────────
export function CardSkeleton({ lines = 3 }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <Shimmer className="mb-3 h-4 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer key={i} className={`mb-2 h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}

// ── Stats skeleton ────────────────────────────────────────────────────────────
export function StatsSkeleton({ cols = 4 }) {
  return (
    <div className={`grid gap-3 sm:grid-cols-${Math.min(cols, 4)}`}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <Shimmer className="mb-2 h-8 w-8 rounded-xl" />
          <Shimmer className="mb-1 h-7 w-1/2" />
          <Shimmer className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  )
}

// ── Lesson card skeleton ──────────────────────────────────────────────────────
export function LessonCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex gap-2">
        <Shimmer className="h-5 w-12 rounded-full" />
        <Shimmer className="h-5 w-16 rounded-full" />
      </div>
      <Shimmer className="mb-2 h-4 w-3/4" />
      <Shimmer className="mb-3 h-3 w-full" />
      <Shimmer className="h-3 w-1/2" />
      <div className="mt-3 flex items-center justify-between">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-3 w-8" />
      </div>
    </div>
  )
}

// ── Word card skeleton ────────────────────────────────────────────────────────
export function WordCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <Shimmer className="h-5 w-24" />
        <Shimmer className="h-4 w-16 rounded-full" />
      </div>
      <Shimmer className="mb-1 h-3 w-1/2" />
      <Shimmer className="h-3 w-full" />
      <div className="mt-3 flex gap-1">
        {[0,1,2,3,4,5].map((i) => <Shimmer key={i} className="h-1 flex-1 rounded-full" />)}
      </div>
    </div>
  )
}

// ── Chat skeleton ─────────────────────────────────────────────────────────────
export function ChatSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[false, true, false, true].map((isMe, i) => (
        <div key={i} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
          <Shimmer className="h-9 w-9 shrink-0 rounded-full" />
          <div className={`space-y-1.5 ${isMe ? 'items-end flex flex-col' : ''}`}>
            <Shimmer className="h-3 w-12 rounded-full" />
            <Shimmer className={`h-10 rounded-2xl ${isMe ? 'w-40' : 'w-56'}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Leaderboard skeleton ──────────────────────────────────────────────────────
export function LeaderboardSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3">
          <Shimmer className="h-8 w-8 shrink-0 rounded-full" />
          <Shimmer className="h-9 w-9 shrink-0 rounded-full" />
          <div className="flex-1">
            <Shimmer className="mb-1 h-4 w-1/3" />
            <Shimmer className="h-3 w-1/4" />
          </div>
          <Shimmer className="h-5 w-16" />
        </div>
      ))}
    </div>
  )
}

// ── Full page skeleton ────────────────────────────────────────────────────────
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        {/* Sidebar */}
        <div className="hidden w-[250px] shrink-0 xl:block">
          <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-md" style={{ height: 'calc(100vh - 40px)' }}>
            <Shimmer className="mb-8 h-10 w-32" />
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <Shimmer key={i} className="h-10 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
        {/* Main */}
        <div className="w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <div className="mb-6">
            <Shimmer className="mb-2 h-8 w-48" />
            <Shimmer className="h-4 w-64" />
          </div>
          <StatsSkeleton cols={4} />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <LessonCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shimmer
