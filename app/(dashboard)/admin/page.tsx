import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import AdminUsersTable from '@/components/admin/AdminUsersTable'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const serviceClient = createServiceClient()
  const { data: profile } = await serviceClient
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user!.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/chat')
  }

  const { data: users } = await serviceClient
    .from('user_profiles')
    .select('id, email, display_name, is_admin, trial_expires_at, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--bg-base)', padding: '32px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '6px' }}>
            Gebruikersbeheer
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Beheer proefperiodes en toegang per gebruiker.
          </p>
        </div>
        <AdminUsersTable users={users ?? []} />
      </div>
    </div>
  )
}
