'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { day: '1 jun', profit: 0 },
  { day: '3 jun', profit: 90 },
  { day: '5 jun', profit: 90 },
  { day: '7 jun', profit: 210 },
  { day: '8 jun', profit: 1240 },
]

export default function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#059669" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
        <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '10px', color: '#fff' }}
          labelStyle={{ color: '#9ca3af', fontSize: 11 }}
          formatter={(v) => [`CHF ${v}`, 'Bénéfice']}
        />
        <Area type="monotone" dataKey="profit" stroke="#059669" strokeWidth={2} fill="url(#profitGradient)" dot={{ fill: '#059669', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: '#10b981' }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
