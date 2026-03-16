export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase/server'
import UserTable from '@/components/admin/UserTable'
import Link from 'next/link'

export default async function AdminPage() {
  const serviceClient = createServiceClient()

  const { data: users } = await serviceClient
    .from('user_profiles')
    .select('id, email, display_name, is_admin, trial_expires_at, created_at')
    .order('created_at', { ascending: false })

  const { data: credentials } = await serviceClient
    .from('trainin_credentials')
    .select('user_id, is_verified, trainin_account_name, last_verified_at')

  const credMap = new Map(credentials?.map((c) => [c.user_id, c]) ?? [])

  const usersWithCreds = (users ?? []).map((u) => ({
    ...u,
    credentials: credMap.get(u.id) ?? null,
  }))

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Admin — Gebruikersbeheer
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Accounts aanmaken en Trainin credentials instellen
          </p>
        </div>
        <Link
          href="/chat"
          style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', marginTop: '4px' }}
        >
          ← Terug naar app
        </Link>
      </div>

      <UserTable initialUsers={usersWithCreds} />
    </div>
  )
}
