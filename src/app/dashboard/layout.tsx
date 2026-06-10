import AppProvider from '@/components/AppProvider'
import DashboardNav from '@/components/DashboardNav'
import PageTransition from '@/components/PageTransition'
import { ThemeProvider } from '@/components/ThemeProvider'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
    <AppProvider>
      <div className="min-h-screen flex" style={{ background: 'var(--surface-bg)', color: 'var(--text-primary)' }}>
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 left-64 w-[500px] h-[300px] bg-emerald-600/[0.04] blur-[100px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-emerald-900/[0.06] blur-[120px] rounded-full" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>
        <DashboardNav />
        <main className="flex-1 md:ml-64 min-h-screen relative z-10">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </AppProvider>
    </ThemeProvider>
  )
}
