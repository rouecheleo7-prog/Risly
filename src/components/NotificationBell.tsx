'use client'

import { useState, useEffect, useMemo } from 'react'
import { Bell, X, Target, CalendarDays, CheckCircle2, BellOff } from 'lucide-react'
import { useApp } from '@/lib/store'

interface Alert {
  id: string
  type: 'goal' | 'drop_urgent' | 'drop_today'
  title: string
  subtitle: string
  emoji: string
}

const DISMISSED_KEY = 'risly_dismissed_alerts'

function getDismissed(): string[] {
  try { return JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]') } catch { return [] }
}
function addDismissed(id: string) {
  const prev = getDismissed()
  localStorage.setItem(DISMISSED_KEY, JSON.stringify([...new Set([...prev, id])]))
}

export default function NotificationBell() {
  const { goals, drops } = useApp()
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState<string[]>([])
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    setDismissed(getDismissed())
    if (typeof Notification !== 'undefined') setPermission(Notification.permission)
  }, [])

  const today = new Date().toISOString().split('T')[0]

  const alerts = useMemo((): Alert[] => {
    const list: Alert[] = []

    // Objectifs atteints
    for (const g of goals) {
      if (g.current >= g.target) {
        list.push({
          id: `goal_${g.id}`,
          type: 'goal',
          title: 'Objectif atteint ! 🎉',
          subtitle: `${g.label} — ${g.current} / ${g.target} ${g.unit}`,
          emoji: '🏆',
        })
      }
    }

    // Drops urgents (aujourd'hui ou demain ou dans 2 jours)
    for (const d of drops) {
      const diff = Math.ceil((new Date(d.date).getTime() - new Date(today).getTime()) / 86400000)
      if (diff === 0) {
        list.push({
          id: `drop_${d.id}`,
          type: 'drop_today',
          title: "Drop aujourd'hui !",
          subtitle: d.title + (d.note ? ` · ${d.note}` : ''),
          emoji: d.type === 'achat' ? '🛒' : '💰',
        })
      } else if (diff === 1) {
        list.push({
          id: `drop_${d.id}`,
          type: 'drop_urgent',
          title: 'Drop demain',
          subtitle: d.title + (d.note ? ` · ${d.note}` : ''),
          emoji: d.type === 'achat' ? '🛒' : '💰',
        })
      } else if (diff === 2) {
        list.push({
          id: `drop_${d.id}`,
          type: 'drop_urgent',
          title: 'Drop dans 2 jours',
          subtitle: d.title + (d.note ? ` · ${d.note}` : ''),
          emoji: d.type === 'achat' ? '🛒' : '💰',
        })
      }
    }

    return list
  }, [goals, drops, today])

  const visible = alerts.filter(a => !dismissed.includes(a.id))
  const count = visible.length

  // Notifications navigateur : fire une fois par session pour les nouveaux
  useEffect(() => {
    if (permission !== 'granted') return
    const firedKey = 'risly_notif_fired'
    const fired: string[] = JSON.parse(sessionStorage.getItem(firedKey) || '[]')
    for (const a of alerts) {
      if (!dismissed.includes(a.id) && !fired.includes(a.id)) {
        new Notification(`Risly · ${a.title}`, { body: a.subtitle, icon: '/favicon.ico' })
        fired.push(a.id)
      }
    }
    sessionStorage.setItem(firedKey, JSON.stringify(fired))
  }, [alerts, permission, dismissed])

  function dismiss(id: string) {
    addDismissed(id)
    setDismissed(prev => [...prev, id])
  }
  function dismissAll() {
    visible.forEach(a => addDismissed(a.id))
    setDismissed(getDismissed())
  }

  async function requestPermission() {
    if (typeof Notification === 'undefined') return
    const result = await Notification.requestPermission()
    setPermission(result)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
        style={{ background: open ? 'rgba(5,150,105,0.12)' : 'var(--surface-input)', color: count > 0 ? '#10b981' : 'var(--text-muted)' }}
      >
        <Bell size={16} strokeWidth={count > 0 ? 2.5 : 1.75} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 w-80 rounded-3xl border shadow-2xl z-50 overflow-hidden"
            style={{ background: 'var(--surface-modal)', borderColor: 'var(--border)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <p className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</p>
              <div className="flex items-center gap-2">
                {visible.length > 1 && (
                  <button onClick={dismissAll} className="text-xs px-2.5 py-1 rounded-lg font-medium transition-colors" style={{ color: 'var(--text-muted)', background: 'var(--surface-input)' }}>
                    Tout effacer
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface-input)', color: 'var(--text-muted)' }}>
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Liste */}
            <div className="max-h-80 overflow-y-auto">
              {visible.length === 0 ? (
                <div className="text-center py-10">
                  <CheckCircle2 size={28} className="mx-auto mb-2 text-emerald-500 opacity-50" />
                  <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Tout est à jour</p>
                </div>
              ) : (
                visible.map(alert => (
                  <div key={alert.id} className="flex items-start gap-3 px-4 py-3.5 border-b last:border-0 group" style={{ borderColor: 'var(--border)' }}>
                    <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-base shrink-0"
                      style={{ background: alert.type === 'goal' ? 'rgba(5,150,105,0.1)' : alert.type === 'drop_today' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)' }}>
                      {alert.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{alert.title}</p>
                      <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{alert.subtitle}</p>
                    </div>
                    <button onClick={() => dismiss(alert.id)} className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all" style={{ color: 'var(--text-muted)' }}>
                      <X size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Permission navigateur */}
            {permission === 'default' && (
              <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border)', background: 'rgba(5,150,105,0.05)' }}>
                <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Activer les alertes navigateur pour rester informé</p>
                <button onClick={requestPermission} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95">
                  Activer les notifications
                </button>
              </div>
            )}
            {permission === 'denied' && (
              <div className="px-4 py-3 border-t flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                <BellOff size={13} style={{ color: 'var(--text-muted)' }} />
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Notifications bloquées par le navigateur</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
