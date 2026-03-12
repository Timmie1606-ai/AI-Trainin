'use client'

import { useState } from 'react'

interface CredentialsMeta {
  is_verified: boolean
  last_verified_at: string | null
  trainin_account_name: string | null
}

interface CredentialsFormProps {
  existing: CredentialsMeta | null
}

export default function CredentialsForm({ existing }: CredentialsFormProps) {
  const [apiKey, setApiKey] = useState('')
  const [tenantId, setTenantId] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [accountName, setAccountName] = useState(existing?.trainin_account_name ?? '')
  const [isVerified, setIsVerified] = useState(existing?.is_verified ?? false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    setSaveStatus('saving')

    const res = await fetch('/api/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, tenantId }),
    })

    if (!res.ok) {
      const data = await res.json()
      setErrorMsg(data.error ?? 'Opslaan mislukt')
      setSaveStatus('error')
      return
    }

    setSaveStatus('saved')
    setIsVerified(false)
    setApiKey('')
    setTenantId('')
    setTimeout(() => setSaveStatus('idle'), 3000)
  }

  async function handleVerify() {
    setVerifyStatus('verifying')
    setErrorMsg('')

    const res = await fetch('/api/credentials/verify', { method: 'POST' })
    const data = await res.json()

    if (!res.ok) {
      setErrorMsg(data.error ?? 'Verificatie mislukt')
      setVerifyStatus('error')
      setIsVerified(false)
      return
    }

    setVerifyStatus('success')
    setIsVerified(true)
    setAccountName(data.accountName ?? '')
    setTimeout(() => setVerifyStatus('idle'), 4000)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-default)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'var(--font-geist-mono, monospace)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Status indicator */}
      {existing && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 16px',
          borderRadius: '12px',
          background: isVerified ? 'rgba(0,212,170,0.08)' : 'rgba(251,191,36,0.08)',
          border: `1px solid ${isVerified ? 'rgba(0,212,170,0.2)' : 'rgba(251,191,36,0.2)'}`,
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            flexShrink: 0,
            background: isVerified ? '#00d4aa' : '#fbbf24',
            boxShadow: isVerified ? '0 0 6px rgba(0,212,170,0.5)' : '0 0 6px rgba(251,191,36,0.5)',
          }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: isVerified ? '#00d4aa' : '#fbbf24' }}>
              {isVerified ? 'Verbonden' : 'Niet geverifieerd'}
            </p>
            {accountName && (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{accountName}</p>
            )}
          </div>
          <button
            onClick={handleVerify}
            disabled={verifyStatus === 'verifying'}
            style={{
              fontSize: '12px',
              padding: '6px 12px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              cursor: verifyStatus === 'verifying' ? 'not-allowed' : 'pointer',
              opacity: verifyStatus === 'verifying' ? 0.6 : 1,
              transition: 'all 0.15s',
              flexShrink: 0,
            }}
          >
            {verifyStatus === 'verifying' ? 'Verifiëren...' : 'Opnieuw verifiëren'}
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Trainin API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            placeholder={existing ? '••••••••••••••••' : 'Voer je API Key in'}
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-strong)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,200,190,0.10)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Te vinden in je Trainin dashboard onder Instellingen → API
          </p>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Tenant ID
          </label>
          <input
            type="text"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            required
            placeholder={existing ? '••••••••' : 'Voer je Tenant ID in'}
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-strong)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,200,190,0.10)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </div>

        {errorMsg && (
          <div style={{
            padding: '12px 14px',
            background: 'rgba(248,113,113,0.1)',
            border: '1px solid rgba(248,113,113,0.25)',
            borderRadius: '10px',
            color: '#f87171',
            fontSize: '13px',
          }}>
            {errorMsg}
          </div>
        )}

        {saveStatus === 'saved' && (
          <div style={{
            padding: '12px 14px',
            background: 'rgba(0,212,170,0.1)',
            border: '1px solid rgba(0,212,170,0.25)',
            borderRadius: '10px',
            color: '#00d4aa',
            fontSize: '13px',
          }}>
            Credentials opgeslagen. Klik op &ldquo;Verbinding verifiëren&rdquo; om te testen.
          </div>
        )}

        {verifyStatus === 'success' && (
          <div style={{
            padding: '12px 14px',
            background: 'rgba(0,212,170,0.1)',
            border: '1px solid rgba(0,212,170,0.25)',
            borderRadius: '10px',
            color: '#00d4aa',
            fontSize: '13px',
          }}>
            Verbinding succesvol geverifieerd{accountName ? ` voor ${accountName}` : ''}!
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={saveStatus === 'saving'}
            style={{
              flex: 1,
              padding: '11px 16px',
              background: 'var(--brand-gradient)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
              opacity: saveStatus === 'saving' ? 0.7 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {saveStatus === 'saving' ? 'Opslaan...' : existing ? 'Credentials bijwerken' : 'Credentials opslaan'}
          </button>
          {existing && saveStatus !== 'saving' && (
            <button
              type="button"
              onClick={handleVerify}
              disabled={verifyStatus === 'verifying'}
              style={{
                padding: '11px 16px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: '12px',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: verifyStatus === 'verifying' ? 'not-allowed' : 'pointer',
                opacity: verifyStatus === 'verifying' ? 0.6 : 1,
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {verifyStatus === 'verifying' ? 'Verifiëren...' : 'Verbinding testen'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
