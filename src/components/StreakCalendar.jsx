import { useMemo } from 'react'
import { Flame } from 'lucide-react'
import { useUser } from '../context/UserContext'

const MONTHS = ['Yan','Fev','Mar','Apr','May','Iyu','Iyl','Avg','Sen','Okt','Nov','Dec']
const DAYS   = ['D','S','Ch','P','J','Sh','Ya']

export function StreakCalendar() {
  const { user } = useUser()
  const streak = user?.streak || 0

  // Generate last 10 weeks (70 days) of activity
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const cells = useMemo(() => {
    const result = []
    for (let i = 69; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const daysAgo = i
      // Simulate activity — more recent days more likely active
      const active = daysAgo === 0 ? true
        : daysAgo <= streak ? Math.random() > 0.15
        : Math.random() > 0.75
      result.push({
        date:   d,
        active,
        isToday: daysAgo === 0,
        level:  active ? (daysAgo <= 7 ? 4 : daysAgo <= 21 ? 3 : daysAgo <= 35 ? 2 : 1) : 0,
      })
    }
    return result
  }, [streak])

  const LEVEL_COLORS = [
    'bg-slate-100',
    'bg-indigo-200',
    'bg-indigo-400',
    'bg-indigo-600',
    'bg-indigo-800',
  ]

  const totalActive = cells.filter((c) => c.active).length

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100">
            <Flame size={15} className="text-orange-500" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900">Streak Kalendar</p>
            <p className="text-[11px] text-slate-400">So'nggi 10 hafta</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-orange-500">{streak}</p>
          <p className="text-[11px] text-slate-400">kun ketma-ket</p>
        </div>
      </div>

      {/* Day labels */}
      <div className="mb-1 grid grid-cols-[auto_1fr] gap-x-2">
        <div className="w-5" />
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((d) => (
            <p key={d} className="text-center text-[9px] font-bold text-slate-400">{d}</p>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-1">
        {Array.from({ length: 10 }).map((_, weekIdx) => {
          const weekCells = cells.slice(weekIdx * 7, weekIdx * 7 + 7)
          const firstDay  = weekCells[0]?.date
          const showMonth = firstDay && firstDay.getDate() <= 7
          return (
            <div key={weekIdx} className="grid grid-cols-[auto_1fr] items-center gap-x-2">
              <p className="w-5 text-[8px] text-slate-300 text-right">
                {showMonth ? MONTHS[firstDay.getMonth()] : ''}
              </p>
              <div className="grid grid-cols-7 gap-1">
                {weekCells.map((cell, i) => (
                  <div key={i}
                    title={`${cell.date.toLocaleDateString('uz-UZ')}${cell.active ? ' ✓ Faol' : ''}`}
                    className={`aspect-square rounded-sm transition ${LEVEL_COLORS[cell.level]} ${cell.isToday ? 'ring-2 ring-orange-400 ring-offset-1' : ''}`}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend + stats */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <span>Kam</span>
          {LEVEL_COLORS.map((c, i) => (
            <div key={i} className={`h-3 w-3 rounded-sm ${c}`} />
          ))}
          <span>Ko'p</span>
        </div>
        <p className="text-[11px] font-semibold text-slate-500">
          {totalActive} kun faol / 70 kundan
        </p>
      </div>
    </div>
  )
}

export default StreakCalendar
