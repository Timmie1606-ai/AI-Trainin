export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      {/* Background gradient decorations */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,171,231,0.12) 0%, transparent 65%),
          radial-gradient(ellipse 40% 40% at 10% 80%, rgba(0,81,194,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 90% 20%, rgba(0,171,231,0.05) 0%, transparent 60%)
        `,
      }} />

      {/* Header met logo */}
      <header style={{
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <Link href="/">
          <Image src="/trainin-logo-color.svg" alt="Traininsight" width={192} height={44} priority style={{ display: 'block', objectFit: 'contain' }} />
        </Link>
      </header>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', position: 'relative', zIndex: 1 }}>
        {children}
      </div>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 1,
        textAlign: 'center', padding: '20px', fontSize: '12px',
        color: 'rgba(245,245,247,0.22)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        © {new Date().getFullYear()} Traininsight · Een initiatief van{' '}
        <a
          href="https://deaistrateeg.nl"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'rgba(245,245,247,0.35)', textDecoration: 'none' }}
        >
          De AI Strateeg
        </a>
      </footer>
    </div>
  )
}
