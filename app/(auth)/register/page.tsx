'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/chat')
    router.refresh()
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Account aanmaken
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Start gratis met Traininsight
        </p>
      </div>

      <div
        className="rounded-2xl p-8 border"
        style={{
          background: 'var(--bg-elevated)',
          borderColor: 'var(--border-default)',
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="displayName" className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>
              Naam
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:outline-none"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
              }}
              placeholder="Jan de Vries"
              onFocus={(e) => e.target.style.borderColor = '#00abe7'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
              suppressHydrationWarning
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>
              E-mailadres
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:outline-none"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
              }}
              placeholder="jouw@email.nl"
              onFocus={(e) => e.target.style.borderColor = '#00abe7'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
              suppressHydrationWarning
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>
              Wachtwoord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:outline-none"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
              }}
              placeholder="Minimaal 8 tekens"
              onFocus={(e) => e.target.style.borderColor = '#00abe7'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
              suppressHydrationWarning
            />
          </div>

          {error && (
            <div
              className="p-3 rounded-xl text-sm"
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#f87171',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-semibold rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--brand-gradient)' }}
          >
            {loading ? 'Account aanmaken...' : 'Account aanmaken'}
          </button>
        </form>
      </div>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
        Al een account?{' '}
        <Link href="/login" className="font-medium hover:opacity-80 transition-opacity" style={{ color: '#00abe7' }}>
          Inloggen
        </Link>
      </p>
    </div>
  )
}
