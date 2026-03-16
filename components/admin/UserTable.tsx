'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface UserCredentials {
  user_id: string
  is_verified: boolean
  trainin_account_name: string | null
  last_verified_at: string | null
}

interface User {
  id: string
  email: string
  display_name: string | null
  is_admin: boolean
  trial_expires_at: string | null
  created_at: string
  credentials: UserCredentials | null
}

function getTrialLabel(user: User): { label: string; color: string } {
  if (user.is_admin) return { label: '∞ Admin', color: '#00abe7' }
  if (!user.trial_expires_at) {
    const days = (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)
    if (days > 7) return { label: 'Verlopen', color: '#ef4444' }
    return { label: `${Math.ceil(7 - days)}d resterend`, color: '#f59e0b' }
  }
  if (new Date(user.trial_expires_at).getFullYear() > 2090) return { label: '∞ Permanent', color: '#10b981' }
  if (new Date(user.trial_expires_at) < new Date()) return { label: 'Verlopen', color: '#ef4444' }
  const days = Math.ceil((new Date(user.trial_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  return { label: `${days}d resterend`, color: '#f59e0b' }
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: 'var(--bg-card)',
  border: '1px solid var(--border-default)',
  borderRadius: '12px',
  color: 'var(--text-primary)',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
}

const btnPrimary: React.CSSProperties = {
  padding: '10px 18px',
  background: 'var(--brand-gradient)',
  border: 'none',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
}

const btnSecondary: React.CSSProperties = {
  padding: '8px 14px',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-default)',
  borderRadius: '10px',
  color: 'var(--text-secondary)',
  fontSize: '12px',
  fontWeight: 500,
  cursor: 'pointer',
  whiteSpace: 'nowrap' as const,
}

export default function UserTable({ initialUsers }: { initialUsers: User[] }) {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [showNewUser, setShowNewUser] = useState(false)

  // Nieuw account formulier state
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newName, setNewName] = useState('')
  const [createStatus, setCreateStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [createError, setCreateError] = useState('')

  // Verwijderen
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'loading'>('idle')

  // Trial management
  const [trialSavingId, setTrialSavingId] = useState<string | null>(null)

  async function updateTrial(userId: string, trial_expires_at: string) {
    setTrialSavingId(userId)
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, trial_expires_at }),
    })
    if (res.ok) {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, trial_expires_at } : u))
    }
    setTrialSavingId(null)
  }

  function extendTrial(user: User, days: number) {
    const base = user.trial_expires_at && new Date(user.trial_expires_at) > new Date()
      ? new Date(user.trial_expires_at) : new Date()
    updateTrial(user.id, new Date(base.getTime() + days * 86400000).toISOString())
  }

  // Credentials formulier per gebruiker
  const [editingCredentials, setEditingCredentials] = useState<string | null>(null)
  const [credApiKey, setCredApiKey] = useState('')
  const [credTenantId, setCredTenantId] = useState('')
  const [credStatus, setCredStatus] = useState<'idle' | 'loading' | 'saved' | 'error'>('idle')
  const [credError, setCredError] = useState('')

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    setCreateStatus('loading')
    setCreateError('')

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail, password: newPassword, displayName: newName }),
    })

    const data = await res.json()
    if (!res.ok) {
      setCreateError(data.error ?? 'Aanmaken mislukt')
      setCreateStatus('error')
      return
    }

    // Lijst verversen
    const listRes = await fetch('/api/admin/users')
    const listData = await listRes.json()
    setUsers(listData.users ?? users)

    setNewEmail('')
    setNewPassword('')
    setNewName('')
    setCreateStatus('idle')
    setShowNewUser(false)
  }

  async function handleSaveCredentials(userId: string) {
    setCredStatus('loading')
    setCredError('')

    const res = await fetch(`/api/admin/users/${userId}/credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: credApiKey, tenantId: credTenantId }),
    })

    const data = await res.json()
    if (!res.ok) {
      setCredError(data.error ?? 'Opslaan mislukt')
      setCredStatus('error')
      return
    }

    // Credential status bijwerken in lijst
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, credentials: { user_id: userId, is_verified: false, trainin_account_name: null, last_verified_at: null } }
          : u
      )
    )

    setCredStatus('saved')
    setCredApiKey('')
    setCredTenantId('')
    setTimeout(() => {
      setCredStatus('idle')
      setEditingCredentials(null)
    }, 2000)
  }

  async function handleDelete(userId: string) {
    setDeleteStatus('loading')
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    }
    setDeleteStatus('idle')
    setConfirmDelete(null)
  }

  function openCredentials(userId: string) {
    setEditingCredentials(userId)
    setCredApiKey('')
    setCredTenantId('')
    setCredStatus('idle')
    setCredError('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header met knop */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setShowNewUser(!showNewUser)}
          style={btnPrimary}
        >
          {showNewUser ? '✕ Annuleren' : '+ Nieuw account'}
        </button>
      </div>

      {/* Nieuw account formulier */}
      {showNewUser && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: '20px',
          padding: '24px',
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px' }}>
            Nieuw account aanmaken
          </h2>
          <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Naam
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Jan de Vries"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  E-mailadres
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="jan@gymname.nl"
                  required
                  style={inputStyle}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Wachtwoord
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimaal 8 tekens"
                required
                minLength={8}
                style={inputStyle}
              />
            </div>

            {createError && (
              <div style={{ padding: '10px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: '10px', color: '#f87171', fontSize: '13px' }}>
                {createError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={createStatus === 'loading'} style={{ ...btnPrimary, opacity: createStatus === 'loading' ? 0.7 : 1 }}>
                {createStatus === 'loading' ? 'Aanmaken...' : 'Account aanmaken'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gebruikerslijst */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: '20px',
        overflow: 'hidden',
      }}>
        {users.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            Nog geen gebruikers
          </div>
        ) : (
          users.map((user, index) => (
            <div key={user.id}>
              {index > 0 && <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0 24px' }} />}

              {/* Gebruiker rij */}
              <div style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    {/* Avatar */}
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'var(--brand-gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#fff',
                      flexShrink: 0,
                    }}>
                      {(user.display_name ?? user.email)[0].toUpperCase()}
                    </div>

                    {/* Info */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {user.display_name ?? '–'}
                        </span>
                        {user.is_admin && (
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 7px',
                            background: 'rgba(0,171,231,0.12)',
                            color: '#00abe7',
                            borderRadius: '6px',
                            border: '1px solid rgba(0,171,231,0.2)',
                          }}>
                            Admin
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</span>
                    </div>
                  </div>

                  {/* Trial status + knoppen */}
                  {!user.is_admin && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <span style={{
                        fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '7px',
                        color: getTrialLabel(user).color,
                        background: `${getTrialLabel(user).color}18`,
                        border: `1px solid ${getTrialLabel(user).color}30`,
                      }}>
                        {getTrialLabel(user).label}
                      </span>
                      <button onClick={() => extendTrial(user, 7)} disabled={!!trialSavingId} style={{ ...btnSecondary, fontSize: '11px', padding: '4px 8px' }}>+7d</button>
                      <button onClick={() => extendTrial(user, 30)} disabled={!!trialSavingId} style={{ ...btnSecondary, fontSize: '11px', padding: '4px 8px' }}>+30d</button>
                      <button onClick={() => updateTrial(user.id, '2099-01-01T00:00:00Z')} disabled={!!trialSavingId} style={{ ...btnSecondary, fontSize: '11px', padding: '4px 8px', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>∞</button>
                      <button onClick={() => updateTrial(user.id, '2000-01-01T00:00:00Z')} disabled={!!trialSavingId} style={{ ...btnSecondary, fontSize: '11px', padding: '4px 8px', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>Blokkeer</button>
                    </div>
                  )}

                  {/* Credential status + knop */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    {user.credentials ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: user.credentials.is_verified ? '#00abe7' : '#fbbf24',
                          boxShadow: user.credentials.is_verified ? '0 0 5px rgba(0,171,231,0.5)' : '0 0 5px rgba(251,191,36,0.5)',
                        }} />
                        <span style={{ fontSize: '12px', color: user.credentials.is_verified ? '#00abe7' : '#fbbf24', fontWeight: 500 }}>
                          {user.credentials.is_verified
                            ? user.credentials.trainin_account_name ?? 'Verbonden'
                            : 'Niet geverifieerd'}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Geen credentials</span>
                    )}

                    <button
                      onClick={() => editingCredentials === user.id ? setEditingCredentials(null) : openCredentials(user.id)}
                      style={btnSecondary}
                    >
                      {editingCredentials === user.id ? 'Annuleren' : user.credentials ? 'Credentials wijzigen' : 'Credentials instellen'}
                    </button>

                    {confirmDelete === user.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12px', color: '#f87171' }}>Zeker weten?</span>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={deleteStatus === 'loading'}
                          style={{ ...btnSecondary, background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}
                        >
                          {deleteStatus === 'loading' ? '...' : 'Ja, verwijder'}
                        </button>
                        <button onClick={() => setConfirmDelete(null)} style={btnSecondary}>Nee</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditingCredentials(null); setConfirmDelete(user.id) }}
                        style={{ ...btnSecondary, color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}
                        title="Gebruiker verwijderen"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline credentials formulier */}
                {editingCredentials === user.id && (
                  <div style={{
                    marginTop: '16px',
                    padding: '20px',
                    background: 'var(--bg-elevated)',
                    borderRadius: '14px',
                    border: '1px solid var(--border-subtle)',
                  }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '14px' }}>
                      Trainin credentials voor {user.display_name ?? user.email}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}>
                          API Key
                        </label>
                        <input
                          type="password"
                          value={credApiKey}
                          onChange={(e) => setCredApiKey(e.target.value)}
                          placeholder="Voer API Key in"
                          style={{ ...inputStyle, fontFamily: 'var(--font-geist-mono, monospace)' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}>
                          Tenant ID
                        </label>
                        <input
                          type="text"
                          value={credTenantId}
                          onChange={(e) => setCredTenantId(e.target.value)}
                          placeholder="bijv. mijn-gym"
                          style={{ ...inputStyle, fontFamily: 'var(--font-geist-mono, monospace)' }}
                        />
                      </div>
                    </div>

                    {credError && (
                      <div style={{ padding: '10px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: '10px', color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>
                        {credError}
                      </div>
                    )}

                    {credStatus === 'saved' && (
                      <div style={{ padding: '10px 14px', background: 'rgba(0,171,231,0.1)', border: '1px solid rgba(0,171,231,0.25)', borderRadius: '10px', color: '#00abe7', fontSize: '13px', marginBottom: '12px' }}>
                        Credentials opgeslagen.
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleSaveCredentials(user.id)}
                        disabled={credStatus === 'loading' || !credApiKey || !credTenantId}
                        style={{
                          ...btnPrimary,
                          opacity: (credStatus === 'loading' || !credApiKey || !credTenantId) ? 0.6 : 1,
                          cursor: (credStatus === 'loading' || !credApiKey || !credTenantId) ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {credStatus === 'loading' ? 'Opslaan...' : 'Opslaan'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
