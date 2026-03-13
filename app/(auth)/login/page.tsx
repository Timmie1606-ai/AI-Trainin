'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/chat')
    router.refresh()
  }

  return (
    <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>

      {/* Card */}
      <div style={{
        borderRadius: '28px',
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'linear-gradient(160deg, rgba(13,26,54,0.95) 0%, rgba(9,18,40,0.98) 100%)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}>
        {/* Top gradient accent */}
        <div style={{ height: '3px', background: 'var(--brand-gradient)' }} />

        <div style={{ padding: '36px 36px 32px' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif",
              fontSize: '32px',
              fontWeight: 800,
              color: '#f5f5f7',
              marginBottom: '6px',
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
            }}>
              WELKOM TERUG
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(245,245,247,0.45)', lineHeight: 1.5 }}>
              Log in op je Traininsight account
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email field */}
            <div>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(245,245,247,0.38)',
                marginBottom: '8px',
              }}>
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
                placeholder="jouw@email.nl"
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(0,171,231,0.50)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(0,171,231,0.10)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.09)'
                  e.target.style.boxShadow = 'none'
                }}
                suppressHydrationWarning
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(245,245,247,0.38)',
                marginBottom: '8px',
              }}>
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
                placeholder="••••••••"
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(0,171,231,0.50)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(0,171,231,0.10)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.09)'
                  e.target.style.boxShadow = 'none'
                }}
                suppressHydrationWarning
              />
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '13px',
                lineHeight: 1.5,
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.22)',
                color: '#f87171',
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px 24px',
                borderRadius: '14px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#fff',
                background: 'var(--brand-gradient)',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'opacity 0.15s',
                boxShadow: '0 4px 20px rgba(0,171,231,0.28)',
                letterSpacing: '-0.01em',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? 'Inloggen...' : (
                <>
                  Inloggen
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Card footer */}
        <div style={{
          padding: '16px 36px 24px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '13px', color: 'rgba(245,245,247,0.35)' }}>
            Nog geen account?{' '}
            <Link href="/register" style={{
              fontWeight: 600,
              color: '#00abe7',
              textDecoration: 'none',
            }}>
              Gratis registreren
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
