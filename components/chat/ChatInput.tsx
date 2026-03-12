'use client'

import { useState, useRef, useEffect } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export default function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
  }, [value])

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const canSend = !disabled && !!value.trim()

  return (
    <div
      style={{
        flexShrink: 0,
        padding: '12px 20px 20px',
        background: 'var(--bg-base)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        suppressHydrationWarning
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '12px',
          padding: '12px 14px 12px 18px',
          background: 'var(--bg-surface)',
          border: `1px solid ${focused ? 'rgba(0,200,190,0.32)' : 'var(--border-default)'}`,
          borderRadius: '22px',
          boxShadow: focused
            ? '0 0 0 3px rgba(0,200,190,0.08), var(--shadow-input)'
            : 'var(--shadow-input)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <textarea
          ref={textareaRef}
          suppressHydrationWarning
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          rows={1}
          placeholder={placeholder ?? 'Stel een vraag over je bedrijf...'}
          style={{
            flex: 1,
            resize: 'none',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: 1.6,
            caretColor: '#00C8BE',
            fontFamily: 'inherit',
            opacity: disabled ? 0.45 : 1,
          }}
        />

        <button
          type="submit"
          disabled={!canSend}
          aria-label="Verstuur bericht"
          style={{
            flexShrink: 0,
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            border: 'none',
            cursor: canSend ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: canSend
              ? 'var(--brand-gradient)'
              : 'rgba(255,255,255,0.06)',
            color: canSend ? '#fff' : 'var(--text-muted)',
            boxShadow: canSend ? '0 2px 10px rgba(0,200,190,0.30)' : 'none',
            transition: 'all 0.15s cubic-bezier(0.16,1,0.3,1)',
            transform: 'scale(1)',
          }}
          onMouseEnter={(e) => {
            if (canSend) {
              e.currentTarget.style.transform = 'scale(1.07)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,200,190,0.40)'
            }
          }}
          onMouseLeave={(e) => {
            if (canSend) {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,200,190,0.30)'
            }
          }}
        >
          {disabled ? (
            <svg
              style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }}
              fill="none"
              viewBox="0 0 24 24"
            >
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </form>

      <p style={{
        textAlign: 'center',
        fontSize: '11px',
        color: 'var(--text-muted)',
        marginTop: '10px',
        fontWeight: 400,
      }}>
        Enter om te sturen · Shift+Enter voor nieuwe regel
      </p>
    </div>
  )
}
