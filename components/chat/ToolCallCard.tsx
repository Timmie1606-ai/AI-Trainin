import type { ReactElement } from 'react'

interface ToolCallCardProps {
  toolName: string
  status: 'loading' | 'done' | 'error'
}

const TOOL_LABELS: Record<string, string> = {
  get_clients: 'Klanten ophalen',
  get_orders: 'Bestellingen ophalen',
  get_sessions: 'Sessies ophalen',
  get_businesses: 'Bedrijfsinfo ophalen',
}

const TOOL_SVG: Record<string, ReactElement> = {
  get_clients: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  get_orders: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  get_sessions: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  get_businesses: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
}

const DEFAULT_SVG = (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
  </svg>
)

export default function ToolCallCard({ toolName, status }: ToolCallCardProps) {
  const label = TOOL_LABELS[toolName] ?? toolName
  const icon = TOOL_SVG[toolName] ?? DEFAULT_SVG

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs max-w-xs"
      style={{
        background: 'rgba(0, 171, 231, 0.08)',
        border: '1px solid rgba(0, 171, 231, 0.2)',
        color: '#00abe7',
      }}
    >
      <span className="flex-shrink-0 opacity-80">{icon}</span>
      <span className="flex-1 font-medium">{label}</span>

      {status === 'loading' && (
        <span className="flex gap-0.5 flex-shrink-0">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1 h-1 rounded-full animate-bounce"
              style={{ background: '#00abe7', animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
      )}
      {status === 'done' && (
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="#34d399" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {status === 'error' && (
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="#f87171" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
    </div>
  )
}
