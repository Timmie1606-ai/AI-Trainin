'use client'

import { useEffect, useRef } from 'react'
import MessageBubble, { type Message } from './MessageBubble'
import TypingIndicator from './TypingIndicator'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
  onSend?: (message: string) => void
}

const CATEGORIES = [
  {
    icon: (
      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    label: 'Kengetallen',
    accent: '#0051c2',
    bg: 'rgba(0,81,194,0.08)',
    border: 'rgba(0,81,194,0.18)',
    questions: ['Bereken mijn LTV', 'Wat is mijn churn rate?'],
  },
  {
    icon: (
      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Omzet',
    accent: '#00abe7',
    bg: 'rgba(0,171,231,0.08)',
    border: 'rgba(0,171,231,0.18)',
    questions: ['Hoeveel omzet heb ik deze maand?', 'Vergelijk mijn omzet met vorige maand'],
  },
  {
    icon: (
      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Klanten',
    accent: '#00f2f6',
    bg: 'rgba(0,171,231,0.07)',
    border: 'rgba(0,171,231,0.16)',
    questions: ['Welke klanten hebben al 30 dagen niet geboekt?', 'Hoeveel nieuwe klanten heb ik deze maand?'],
  },
  {
    icon: (
      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Sessies',
    accent: '#7c3aed',
    bg: 'rgba(124,58,237,0.08)',
    border: 'rgba(124,58,237,0.18)',
    questions: ['Wat is mijn bezettingsgraad deze week?', 'Welke lessen zijn het drukst?'],
  },
  {
    icon: (
      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    label: 'Inzichten',
    accent: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.18)',
    questions: ['Wat is mijn gemiddelde orderwaarde?', 'Geef een bedrijfssamenvatting'],
  },
]

export default function MessageList({ messages, isLoading, onSend }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (messages.length === 0 && !isLoading) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center overflow-y-auto"
        style={{ background: 'var(--bg-base)', padding: '40px 24px' }}
      >
        <div style={{ width: '100%', maxWidth: '680px' }}>
          {/* Welcome heading */}
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '28px', overflow: 'hidden', margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(0,171,231,0.28)' }}>
              <img src="/traininsight-favicon.svg" alt="Traininsight" width={120} height={120} style={{ display: 'block', objectFit: 'cover', width: '100%', height: '100%' }} />
            </div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}>
              Wat wil je weten?
            </h2>
            <p style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '380px',
              margin: '0 auto',
            }}>
              Stel een vraag in gewoon Nederlands over je omzet, klanten of kengetallen.
            </p>
          </div>

          {/* Category grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
          }}>
            {CATEGORIES.map((cat, idx) => (
              <div
                key={cat.label}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '18px',
                  padding: '16px',
                  border: '1px solid var(--border-card)',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  // Center last 2 cards in 3-col grid
                  ...(CATEGORIES.length === 5 && idx >= 3
                    ? { gridColumn: idx === 3 ? '1 / 2' : '3 / 4' }
                    : {}),
                }}
              >
                {/* Category header */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 10px 5px 7px',
                  borderRadius: '10px',
                  background: cat.bg,
                  border: `1px solid ${cat.border}`,
                  alignSelf: 'flex-start',
                }}>
                  <span style={{ color: cat.accent, display: 'flex' }}>{cat.icon}</span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: cat.accent,
                    letterSpacing: '0.01em',
                  }}>
                    {cat.label}
                  </span>
                </div>

                {/* Question buttons */}
                {cat.questions.map((q) => (
                  <button
                    key={q}
                    onClick={() => onSend?.(q)}
                    style={{
                      textAlign: 'left',
                      padding: '9px 12px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.03)',
                      color: 'var(--text-secondary)',
                      fontSize: '12.5px',
                      lineHeight: 1.5,
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      fontWeight: 500,
                      letterSpacing: '-0.005em',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = cat.bg
                      e.currentTarget.style.color = 'var(--text-primary)'
                      e.currentTarget.style.borderColor = cat.border
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                      e.currentTarget.style.borderColor = 'var(--border-subtle)'
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ background: 'var(--bg-base)', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '6px' }}
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}
