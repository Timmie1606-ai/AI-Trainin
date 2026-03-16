'use client'

import { useState } from 'react'

interface UserProfile {
  id: string
  email: string
  display_name: string | null
  is_admin: boolean
  trial_expires_at: string | null
  created_at: string
}

function getTrialStatus(user: UserProfile): { label: string; color: string; bg: string; border: string } {
  if (user.is_admin) return { label: 'Admin', color: '#00abe7', bg: 'rgba(0,171,231,0.10)', border: 'rgba(0,171,231,0.20)' }
  if (!user.trial_expires_at) {
    const days = (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)
    if (days > 7) return { label: 'Verlopen', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.18)' }
    const remaining = Math.ceil(7 - days)
    return { label: `${remaining}d resterend`, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)' }
  }
  if (new Date(user.trial_expires_at) > new Date(Date.now() + 365 * 10 * 24 * 60 * 60 * 1000)) {
    return { label: 'Permanent', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.18)' }
  }
  if (new Date(user.trial_expires_at) < new Date()) {
    return { label: 'Verlopen', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.18)' }
  }
  const remaining = Math.ceil((new Date(user.trial_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  return { label: `${remaining}d resterend`, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)' }
}

export default function AdminUsersTable({ users }: { users: UserProfile[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [localUsers, setLocalUsers] = useState<UserProfile[]>(users)
  const [editValue, setEditValue] = useState('')

  function startEdit(user: UserProfile) {
    setEditingId(user.id)
    if (user.trial_expires_at) {
      setEditValue(user.trial_expires_at.slice(0, 10))
    } else {
      const defaultExpiry = new Date(new Date(user.created_at).getTime() + 7 * 24 * 60 * 60 * 1000)
      setEditValue(defaultExpiry.toISOString().slice(0, 10))
    }
  }

  async function saveTrialExpiry(userId: string) {
    setSavingId(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, trial_expires_at: editValue ? `${editValue}T23:59:59Z` : null }),
      })
      if (res.ok) {
        setLocalUsers((prev) => prev.map((u) =>
          u.id === userId ? { ...u, trial_expires_at: editValue ? `${editValue}T23:59:59Z` : null } : u
        ))
      }
    } finally {
      setSavingId(null)
      setEditingId(null)
    }
  }

  async function extendTrial(user: UserProfile, days: number) {
    setSavingId(user.id)
    const base = user.trial_expires_at && new Date(user.trial_expires_at) > new Date()
      ? new Date(user.trial_expires_at)
      : new Date()
    const newExpiry = new Date(base.getTime() + days * 24 * 60 * 60 * 1000)
    const expiryStr = newExpiry.toISOString()
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, trial_expires_at: expiryStr }),
      })
      if (res.ok) {
        setLocalUsers((prev) => prev.map((u) =>
          u.id === user.id ? { ...u, trial_expires_at: expiryStr } : u
        ))
      }
    } finally {
      setSavingId(null)
    }
  }

  async function setPermanent(userId: string) {
    setSavingId(userId)
    const permanent = '2099-01-01T00:00:00Z'
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, trial_expires_at: permanent }),
      })
      if (res.ok) {
        setLocalUsers((prev) => prev.map((u) =>
          u.id === userId ? { ...u, trial_expires_at: permanent } : u
        ))
      }
    } finally {
      setSavingId(null)
    }
  }

  async function revokeAccess(userId: string) {
    setSavingId(userId)
    const expired = '2000-01-01T00:00:00Z'
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, trial_expires_at: expired }),
      })
      if (res.ok) {
        setLocalUsers((prev) => prev.map((u) =>
          u.id === userId ? { ...u, trial_expires_at: expired } : u
        ))
      }
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '18px',
      overflow: 'hidden',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            {['Gebruiker', 'Status', 'Aangemeld', 'Verloopdatum', 'Acties'].map((h) => (
              <th key={h} style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-tertiary)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {localUsers.map((user, i) => {
            const status = getTrialStatus(user)
            const isEditing = editingId === user.id
            const isSaving = savingId === user.id
            return (
              <tr key={user.id} style={{
                borderBottom: i < localUsers.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                opacity: isSaving ? 0.6 : 1,
                transition: 'opacity 0.2s',
              }}>
                {/* Gebruiker */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {user.display_name ?? user.email}
                  </div>
                  {user.display_name && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{user.email}</div>
                  )}
                </td>

                {/* Status badge */}
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: status.color,
                    background: status.bg,
                    border: `1px solid ${status.border}`,
                    letterSpacing: '0.01em',
                  }}>
                    {status.label}
                  </span>
                </td>

                {/* Aangemeld */}
                <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  {new Date(user.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>

                {/* Verloopdatum */}
                <td style={{ padding: '14px 16px' }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input
                        type="date"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        style={{
                          background: 'var(--bg-base)',
                          border: '1px solid rgba(0,171,231,0.32)',
                          borderRadius: '8px',
                          padding: '5px 8px',
                          fontSize: '12px',
                          color: 'var(--text-primary)',
                          outline: 'none',
                        }}
                      />
                      <button onClick={() => saveTrialExpiry(user.id)} style={{
                        padding: '5px 10px', borderRadius: '7px', fontSize: '11px', fontWeight: 700,
                        background: '#00abe7', color: '#fff', border: 'none', cursor: 'pointer',
                      }}>OK</button>
                      <button onClick={() => setEditingId(null)} style={{
                        padding: '5px 10px', borderRadius: '7px', fontSize: '11px', fontWeight: 700,
                        background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: 'none', cursor: 'pointer',
                      }}>✕</button>
                    </div>
                  ) : (
                    <span
                      onClick={() => !user.is_admin && startEdit(user)}
                      style={{
                        fontSize: '12px',
                        color: user.is_admin ? 'var(--text-muted)' : 'var(--text-secondary)',
                        cursor: user.is_admin ? 'default' : 'pointer',
                        textDecoration: user.is_admin ? 'none' : 'underline dotted',
                      }}
                    >
                      {user.is_admin
                        ? '∞ Admin'
                        : user.trial_expires_at
                          ? new Date(user.trial_expires_at).getFullYear() > 2090
                            ? '∞ Permanent'
                            : new Date(user.trial_expires_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
                          : `Standaard (${new Date(new Date(user.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })})`
                      }
                    </span>
                  )}
                </td>

                {/* Acties */}
                <td style={{ padding: '14px 16px' }}>
                  {!user.is_admin && !isEditing && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => extendTrial(user, 7)}
                        disabled={isSaving}
                        style={{
                          padding: '4px 10px', borderRadius: '7px', fontSize: '11px', fontWeight: 600,
                          background: 'rgba(0,171,231,0.08)', color: '#00abe7',
                          border: '1px solid rgba(0,171,231,0.16)', cursor: 'pointer',
                        }}
                      >+7 dagen</button>
                      <button
                        onClick={() => extendTrial(user, 30)}
                        disabled={isSaving}
                        style={{
                          padding: '4px 10px', borderRadius: '7px', fontSize: '11px', fontWeight: 600,
                          background: 'rgba(0,171,231,0.08)', color: '#00abe7',
                          border: '1px solid rgba(0,171,231,0.16)', cursor: 'pointer',
                        }}
                      >+30 dagen</button>
                      <button
                        onClick={() => setPermanent(user.id)}
                        disabled={isSaving}
                        style={{
                          padding: '4px 10px', borderRadius: '7px', fontSize: '11px', fontWeight: 600,
                          background: 'rgba(16,185,129,0.08)', color: '#10b981',
                          border: '1px solid rgba(16,185,129,0.16)', cursor: 'pointer',
                        }}
                      >Permanent</button>
                      <button
                        onClick={() => revokeAccess(user.id)}
                        disabled={isSaving}
                        style={{
                          padding: '4px 10px', borderRadius: '7px', fontSize: '11px', fontWeight: 600,
                          background: 'rgba(239,68,68,0.08)', color: '#ef4444',
                          border: '1px solid rgba(239,68,68,0.16)', cursor: 'pointer',
                        }}
                      >Blokkeer</button>
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
