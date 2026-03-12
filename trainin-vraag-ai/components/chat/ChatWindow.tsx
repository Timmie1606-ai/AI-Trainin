'use client'

import { useState, useCallback } from 'react'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import ConversationSidebar from './ConversationSidebar'
import type { Message } from './MessageBubble'

interface Conversation {
  id: string
  title: string | null
  updated_at: string
}

interface ChatWindowProps {
  initialConversations: Conversation[]
  credentialsStatus?: 'missing' | 'unverified' | 'verified'
}

export default function ChatWindow({ initialConversations, credentialsStatus }: ChatWindowProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const activeTitle = conversations.find((c) => c.id === activeConversationId)?.title ?? null

  async function loadConversation(id: string) {
    setActiveConversationId(id)
    const res = await fetch(`/api/conversations/${id}`)
    if (!res.ok) return
    const data = await res.json()
    setMessages(
      (data.messages ?? [])
        .filter((m: { role: string }) => m.role === 'user' || m.role === 'assistant')
        .map((m: { id: string; role: string; content: string }) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          toolCalls: [],
        }))
    )
  }

  function startNewConversation() {
    setActiveConversationId(undefined)
    setMessages([])
  }

  function deleteConversation(id: string) {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (activeConversationId === id) {
      setActiveConversationId(undefined)
      setMessages([])
    }
  }

  const sendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    }

    const aiMessageId = `ai-${Date.now()}`
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      toolCalls: [],
    }

    setMessages((prev) => [...prev, userMessage, aiMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationId: activeConversationId,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMessageId
              ? { ...m, content: err.error ?? 'Er is een fout opgetreden.' }
              : m
          )
        )
        return
      }

      // SSE stream
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) return

      let buffer = ''
      let currentEvent = 'text_delta'

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim()
            continue
          }
          if (!line.startsWith('data: ')) {
            if (line.trim() === '') currentEvent = 'text_delta'
            continue
          }

          const event = currentEvent

          let data: Record<string, unknown>
          try {
            data = JSON.parse(line.slice(6))
          } catch {
            continue
          }

          if (event === 'conversation_id' && data.conversationId) {
            const newId = data.conversationId as string
            setActiveConversationId(newId)
            setConversations((prev) => {
              if (prev.find((c) => c.id === newId)) return prev
              return [
                { id: newId, title: text.slice(0, 60), updated_at: new Date().toISOString() },
                ...prev,
              ]
            })
          }

          if (event === 'tool_start' && data.tool) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aiMessageId
                  ? {
                      ...m,
                      toolCalls: [
                        ...(m.toolCalls ?? []),
                        { name: data.tool as string, status: 'loading' as const },
                      ],
                    }
                  : m
              )
            )
          }

          if (event === 'tool_end' && data.tool) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aiMessageId
                  ? {
                      ...m,
                      toolCalls: (m.toolCalls ?? []).map((tc) =>
                        tc.name === data.tool
                          ? { ...tc, status: (data.success ? 'done' : 'error') as 'done' | 'error' }
                          : tc
                      ),
                    }
                  : m
              )
            )
          }

          if (event === 'text_delta' && data.text) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aiMessageId
                  ? { ...m, content: m.content + (data.text as string) }
                  : m
              )
            )
          }

          if (event === 'error' && data.message) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aiMessageId ? { ...m, content: data.message as string } : m
              )
            )
          }
        }
      }
    } catch (err) {
      console.error('Chat fout:', err)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMessageId
            ? { ...m, content: 'Er is een verbindingsfout opgetreden. Probeer het opnieuw.' }
            : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [activeConversationId])

  return (
    <div className="flex h-full">
      <ConversationSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={loadConversation}
        onNew={startNewConversation}
        onDelete={deleteConversation}
      />

      <div className="flex-1 flex flex-col min-w-0" style={{ background: 'var(--bg-base)' }}>

        {/* Chat header */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          height: '58px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div style={{
              width: '28px', height: '28px',
              borderRadius: '9px',
              background: 'rgba(0,200,190,0.10)',
              border: '1px solid rgba(0,200,190,0.16)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="13" height="13" fill="none" stroke="#00C8BE" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {activeTitle ?? 'Nieuw gesprek'}
            </span>
          </div>

          {messages.length > 0 && (
            <button
              onClick={startNewConversation}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#00C8BE',
                padding: '6px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(0,200,190,0.18)',
                background: 'rgba(0,200,190,0.07)',
                cursor: 'pointer',
                flexShrink: 0,
                letterSpacing: '-0.01em',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,200,190,0.13)'
                e.currentTarget.style.borderColor = 'rgba(0,200,190,0.28)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0,200,190,0.07)'
                e.currentTarget.style.borderColor = 'rgba(0,200,190,0.18)'
              }}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Nieuw gesprek
            </button>
          )}
        </div>

        {/* Credentials banners */}
        {credentialsStatus === 'missing' && (
          <div style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '10px 20px',
            background: 'rgba(239,68,68,0.06)',
            borderBottom: '1px solid rgba(239,68,68,0.14)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '20px', height: '20px',
                borderRadius: '6px',
                background: 'rgba(239,68,68,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="10" height="10" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <span style={{ fontSize: '13px', color: 'rgba(239,100,100,0.9)', fontWeight: 500 }}>
                Je Trainin account is nog niet gekoppeld.
              </span>
            </div>
            <a href="/settings" style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#ef4444',
              textDecoration: 'none',
              padding: '5px 12px',
              borderRadius: '8px',
              background: 'rgba(239,68,68,0.10)',
              border: '1px solid rgba(239,68,68,0.18)',
              flexShrink: 0,
              cursor: 'pointer',
            }}>
              Koppel nu →
            </a>
          </div>
        )}

        {credentialsStatus === 'unverified' && (
          <div style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '10px 20px',
            background: 'rgba(251,191,36,0.05)',
            borderBottom: '1px solid rgba(251,191,36,0.14)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '20px', height: '20px',
                borderRadius: '6px',
                background: 'rgba(251,191,36,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="10" height="10" fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span style={{ fontSize: '13px', color: 'rgba(245,158,11,0.9)', fontWeight: 500 }}>
                Je Trainin koppeling is nog niet geverifieerd.
              </span>
            </div>
            <a href="/settings" style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#f59e0b',
              textDecoration: 'none',
              padding: '5px 12px',
              borderRadius: '8px',
              background: 'rgba(251,191,36,0.08)',
              border: '1px solid rgba(251,191,36,0.18)',
              flexShrink: 0,
              cursor: 'pointer',
            }}>
              Verifieer nu →
            </a>
          </div>
        )}

        <MessageList messages={messages} isLoading={isLoading} onSend={sendMessage} />
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  )
}
