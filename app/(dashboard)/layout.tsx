export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const serviceClient = createServiceClient()
  const { data: profile } = await serviceClient
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <Sidebar isAdmin={profile?.is_admin ?? false} />
      <main className="flex-1 min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
