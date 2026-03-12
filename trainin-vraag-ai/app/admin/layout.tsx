export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { checkIsAdmin } from '@/lib/admin'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await checkIsAdmin()
  if (!isAdmin) redirect('/chat')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {children}
    </div>
  )
}
