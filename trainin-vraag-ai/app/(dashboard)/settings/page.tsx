import { createClient } from '@/lib/supabase/server'
import CredentialsForm from '@/components/settings/CredentialsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: credentials } = await supabase
    .from('trainin_credentials')
    .select('is_verified, last_verified_at, trainin_account_name')
    .eq('user_id', user!.id)
    .single()

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
          Instellingen
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Beheer je Trainin API verbinding
        </p>
      </div>

      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: '20px',
        padding: '24px',
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Trainin API Credentials
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Voer je API Key en Tenant ID in om je Trainin account te koppelen.
            Je credentials worden versleuteld opgeslagen.
          </p>
        </div>

        <CredentialsForm existing={credentials ?? null} />
      </div>

      <div style={{
        marginTop: '16px',
        padding: '16px 20px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
      }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
          Waar vind ik mijn API Key?
        </h3>
        <ol style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.8, paddingLeft: '18px' }}>
          <li>Log in op je Trainin dashboard</li>
          <li>Ga naar Instellingen → Integraties → API</li>
          <li>Kopieer je API Key en Tenant ID</li>
        </ol>
      </div>
    </div>
  )
}
