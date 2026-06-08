'use client'

import { Goal, useApp } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'

interface Props { goal: Goal }

export default function GoalCard({ goal }: Props) {
  const { currency } = useApp()
  const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100)
  const currentLabel = goal.unit === 'devise' ? formatCurrency(goal.current, currency) : `${goal.current} ${goal.unit}`
  const targetLabel  = goal.unit === 'devise' ? formatCurrency(goal.target, currency) : `${goal.target} ${goal.unit}`

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-300">{goal.label}</span>
        <span className={`text-xs font-semibold tabular-nums ${pct >= 100 ? 'text-emerald-400' : 'text-gray-500'}`}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${pct >= 100 ? 'bg-emerald-400' : 'bg-emerald-600'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-gray-600">{currentLabel}</span>
        <span className="text-xs text-gray-700">{targetLabel}</span>
      </div>
    </div>
  )
}
