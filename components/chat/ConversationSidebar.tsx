'use client'

import { useState } from 'react'

interface Conversation {
  id: string
  title: string | null
  updated_at: string
}

interface ConversationSidebarProps {
  conversations: Conversation[]
  activeId?: string
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Vandaag'
  if (diffDays === 1) return 'Gisteren'
  if (diffDays < 7) return `${diffDays} dagen geleden`
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
}

export default function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: ConversationSidebarProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    if (deletingId) return
    setDeletingId(id)
    try {
      await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
      onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div
      className="w-64 flex-shrink-0 flex flex-col h-full"
      style={{
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
      }}
    >
      {/* Header with logo mark */}
      <div style={{
        padding: '18px 14px 12px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        {/* Logo mark */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          paddingLeft: '4px',
        }}>
          <div style={{ width: '73px', height: '40px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
            <img src="/traininsight-favicon.svg" alt="Traininsight" width={73} height={40} style={{ display: 'block', objectFit: 'contain', width: '100%', height: '100%' }} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Gesprekken
          </span>
        </div>

        {/* New conversation button */}
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
          style={{
            padding: '9px 14px',
            background: 'var(--brand-gradient)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            boxShadow: '0 2px 10px rgba(0,171,231,0.22)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,171,231,0.32)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,171,231,0.22)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Nieuw gesprek
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '8px 8px' }}>
        {conversations.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <div style={{
              width: '40px', height: '40px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400, lineHeight: 1.5 }}>
              Nog geen gesprekken.<br />Start een nieuw gesprek.
            </p>
          </div>
        ) : (
          <div className="flex flex-col" style={{ gap: '2px' }}>
            {conversations.map((conv) => {
              const isActive = activeId === conv.id
              const isDeleting = deletingId === conv.id
              return (
                <div
                  key={conv.id}
                  className="group relative"
                  style={{ borderRadius: '12px' }}
                >
                  <button
                    onClick={() => onSelect(conv.id)}
                    className="w-full text-left rounded-xl transition-all"
                    style={{
                      padding: '10px 36px 10px 12px',
                      background: isActive ? 'rgba(0,171,231,0.10)' : 'transparent',
                      border: `1px solid ${isActive ? 'rgba(0,171,231,0.18)' : 'transparent'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.borderColor = 'transparent'
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{
                        width: '6px', height: '6px',
                        borderRadius: '50%',
                        background: isActive ? '#00abe7' : 'transparent',
                        flexShrink: 0,
                        marginTop: '5px',
                        transition: 'background 0.15s',
                      }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? '#f5f5f7' : 'rgba(245,245,247,0.65)',
                          letterSpacing: '-0.01em',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: 1.4,
                        }}>
                          {conv.title ?? 'Gesprek'}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          marginTop: '2px',
                          color: 'var(--text-muted)',
                          fontWeight: 400,
                        }}>
                          {formatDate(conv.updated_at)}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Delete button — verschijnt bij hover */}
                  <button
                    onClick={(e) => handleDelete(e, conv.id)}
                    disabled={isDeleting}
                    aria-label="Verwijder gesprek"
                    className="group-hover:opacity-100"
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      border: 'none',
                      background: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      opacity: 0,
                      transition: 'opacity 0.15s, background 0.15s',
                      color: 'rgba(245,245,247,0.4)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239,68,68,0.14)'
                      e.currentTarget.style.color = '#ef4444'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'rgba(245,245,247,0.4)'
                    }}
                  >
                    {isDeleting ? (
                      <svg style={{ width: '10px', height: '10px', animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" style={{ opacity: 0.75 }} />
                      </svg>
                    ) : (
                      <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
