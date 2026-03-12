export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
      {/* Header met logo */}
      <header className="flex items-center justify-center px-8 py-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <Link href="/">
          <Image src="/traininsight-logo.svg" alt="Traininsight" width={215} height={80} priority style={{ display: 'block', objectFit: 'contain' }} />
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </div>

      {/* Footer */}
      <footer className="text-center py-5 text-xs flex flex-col items-center gap-2" style={{ color: 'var(--text-muted)' }}>
        <span>© {new Date().getFullYear()} Traininsight</span>
        <span>
          Een initiatief van{' '}
          <a
            href="https://deaistrateeg.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Image
              src="/deaistrateeg-custom.svg"
              alt="De AI Strateeg"
              width={90}
              height={22}
              style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }}
            />
          </a>
        </span>
      </footer>
    </div>
  )
}
