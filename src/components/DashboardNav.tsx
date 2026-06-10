'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, TrendingUp, Target, Settings, LogOut, Menu, X, BarChart3, Calculator, Truck } from 'lucide-react'
import { LogoFull } from '@/components/Logo'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/store'
import { useTheme } from '@/components/ThemeProvider'
import { Sun, Moon } from 'lucide-react'

const NAV = [
  { href: '/dashboard',              label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/dashboard/ventes',       label: 'Ventes',          icon: TrendingUp },
  { href: '/dashboard/rapports',     label: 'Rapports',        icon: BarChart3 },
  { href: '/dashboard/objectifs',    label: 'Objectifs',       icon: Target },
  { href: '/dashboard/calculateur',  label: 'Calculateur',     icon: Calculator },
  { href: '/dashboard/fournisseurs', label: 'Fournisseurs',    icon: Truck },
  { href: '/dashboard/parametres',   label: 'Paramètres',      icon: Settings },
]

export default function DashboardNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { currency, setCurrency } = useApp()
  const { theme, toggle } = useTheme()

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.05]">
        <LogoFull size="sm" />
      </div>

      {/* Links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                active
                  ? 'bg-emerald-500/[0.1] text-emerald-400 border border-emerald-500/[0.15] font-medium'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04] font-normal'
              )}
            >
              <Icon
                size={16}
                strokeWidth={active ? 2 : 1.75}
                className={active ? 'text-emerald-400' : 'text-gray-600'}
              />
              {label}
              {active && <div className="ml-auto w-1 h-1 rounded-full bg-emerald-400" />}
            </Link>
          )
        })}
      </nav>

      {/* Theme toggle */}
      <div className="px-4 pb-2">
        <button
          onClick={toggle}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-sm"
          style={{ background: 'var(--surface-input)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          <span className="flex items-center gap-2">
            {theme === 'dark' ? <Moon size={14} className="text-blue-400" /> : <Sun size={14} className="text-yellow-400" />}
            {theme === 'dark' ? 'Mode sombre' : 'Mode clair'}
          </span>
          <div className={cn('w-8 h-4 rounded-full relative transition-colors', theme === 'light' ? 'bg-emerald-600' : 'bg-white/10')}>
            <div className={cn('absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all', theme === 'light' ? 'left-4' : 'left-0.5')} />
          </div>
        </button>
      </div>

      {/* Currency toggle */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-1 p-1 rounded-xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.03)' }}>
          {(['CHF', 'EUR'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={cn(
                'flex-1 py-2 rounded-lg text-xs font-bold transition-all',
                currency === c
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-400'
              )}
            >
              {c === 'CHF' ? '🇨🇭 CHF' : '🇪🇺 EUR'}
            </button>
          ))}
        </div>
      </div>

      {/* User */}
      <div className="px-3 pb-5 border-t border-white/[0.04] pt-3 space-y-0.5">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
            J
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white/90 truncate">Jean Dupont</p>
            <p className="text-xs text-gray-600 truncate">Plan Pro · Actif</p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:text-gray-300 hover:bg-white/[0.03] transition-all"
        >
          <LogOut size={15} strokeWidth={1.75} />
          Déconnexion
        </Link>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 z-40"
        style={{ background: 'var(--surface-nav)', backdropFilter: 'blur(24px)', borderRight: '1px solid var(--border-subtle)' }}>
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
        style={{ background: 'var(--surface-nav)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <LogoFull size="sm" />
        <button onClick={() => setOpen(!open)} className="text-gray-500 hover:text-white transition-colors p-1.5">
          {open ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={1.75} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 h-full w-72 flex flex-col"
            style={{ background: 'var(--surface-nav)', backdropFilter: 'blur(24px)', borderRight: '1px solid var(--border)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="pt-14">
              <NavContent />
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
