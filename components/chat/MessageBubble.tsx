import Image from 'next/image'
import ToolCallCard from './ToolCallCard'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  toolCalls?: Array<{
    name: string
    status: 'loading' | 'done' | 'error'
  }>
}

interface MessageBubbleProps {
  message: Message
}

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight:700;color:var(--text-primary)">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(0,171,231,0.08);color:#00abe7;padding:2px 8px;border-radius:6px;font-size:0.82em;font-family:monospace;border:1px solid rgba(0,171,231,0.14)">$1</code>')
    .replace(/^### (.*$)/gm, '<h3 style="font-weight:700;font-size:0.93em;margin-top:18px;margin-bottom:6px;color:var(--text-primary);letter-spacing:-0.02em">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 style="font-weight:700;font-size:1.03em;margin-top:22px;margin-bottom:8px;color:var(--text-primary);letter-spacing:-0.025em">$1</h2>')
    .replace(/^[-•] (.*$)/gm, '<li style="margin-left:18px;list-style-type:disc;margin-bottom:5px;color:rgba(245,245,247,0.75)">$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li style="margin-left:18px;list-style-type:decimal;margin-bottom:5px;color:rgba(245,245,247,0.75)">$2</li>')
    .replace(/\n\n/g, '</p><p style="margin-top:14px">')
    .replace(/\n/g, '<br/>')
}

function parseMarkdownTable(block: string): { headers: string[]; rows: string[][] } | null {
  const lines = block.trim().split('\n').filter((l) => l.trim())
  if (lines.length < 2) return null

  const parseRow = (line: string) =>
    line
      .split('|')
      .map((c) => c.trim())
      .filter((_, i, arr) => i > 0 && i < arr.length - 1)

  const headers = parseRow(lines[0])
  if (headers.length === 0) return null

  const dataLines = lines.slice(2)
  const rows = dataLines.map(parseRow).filter((r) => r.length > 0)

  return { headers, rows }
}

function downloadCSV(headers: string[], rows: string[][], filename = 'data.csv') {
  const escape = (val: string) => `"${val.replace(/"/g, '""')}"`
  const csvLines = [
    headers.map(escape).join(','),
    ...rows.map((row) => row.map(escape).join(',')),
  ]
  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ marginTop: '12px', marginBottom: '4px' }}>
      <div style={{
        overflowX: 'auto',
        borderRadius: '14px',
        border: '1px solid var(--border-default)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8em' }}>
          <thead>
            <tr style={{ background: 'rgba(0,171,231,0.07)', borderBottom: '1px solid rgba(0,171,231,0.14)' }}>
              {headers.map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: '9px 14px',
                    textAlign: 'left',
                    fontWeight: 700,
                    color: '#00abe7',
                    whiteSpace: 'nowrap',
                    fontSize: '11px',
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                style={{
                  borderBottom: ri < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  background: ri % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                }}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: '8px 14px',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      fontSize: '13px',
                      fontWeight: ci === 0 ? 500 : 400,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => downloadCSV(headers, rows)}
        style={{
          marginTop: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '10px',
          border: '1px solid rgba(0,171,231,0.22)',
          background: 'rgba(0,171,231,0.07)',
          color: '#00abe7',
          fontSize: '11.5px',
          fontWeight: 600,
          cursor: 'pointer',
          letterSpacing: '0.01em',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0,171,231,0.13)'
          e.currentTarget.style.borderColor = 'rgba(0,171,231,0.32)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,171,231,0.07)'
          e.currentTarget.style.borderColor = 'rgba(0,171,231,0.22)'
        }}
      >
        <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download CSV
      </button>
    </div>
  )
}

type Segment =
  | { type: 'text'; content: string }
  | { type: 'table'; headers: string[]; rows: string[][] }

function parseSegments(content: string): Segment[] {
  const lines = content.split('\n')
  const segments: Segment[] = []
  let textLines: string[] = []
  let tableLines: string[] = []
  let inTable = false

  for (const line of lines) {
    const isTableLine = line.trim().startsWith('|')
    if (isTableLine) {
      if (!inTable) {
        if (textLines.length > 0) {
          segments.push({ type: 'text', content: textLines.join('\n') })
          textLines = []
        }
        inTable = true
      }
      tableLines.push(line)
    } else {
      if (inTable) {
        const parsed = parseMarkdownTable(tableLines.join('\n'))
        if (parsed) {
          segments.push({ type: 'table', ...parsed })
        } else {
          textLines.push(...tableLines)
        }
        tableLines = []
        inTable = false
      }
      textLines.push(line)
    }
  }

  if (inTable && tableLines.length > 0) {
    const parsed = parseMarkdownTable(tableLines.join('\n'))
    if (parsed) {
      if (textLines.length > 0) {
        segments.push({ type: 'text', content: textLines.join('\n') })
        textLines = []
      }
      segments.push({ type: 'table', ...parsed })
    } else {
      textLines.push(...tableLines)
    }
  }

  if (textLines.length > 0) {
    segments.push({ type: 'text', content: textLines.join('\n') })
  }

  return segments
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const segments = isUser ? null : parseSegments(message.content)

  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '10px',
        flexDirection: isUser ? 'row-reverse' : 'row',
        marginBottom: '4px',
      }}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div style={{
          flexShrink: 0,
          width: '66px',
          height: '36px',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '2px',
          boxShadow: '0 2px 10px rgba(0,171,231,0.25)',
        }}>
          <Image
            src="/favicon.svg"
            alt="Traininsight"
            width={66}
            height={36}
            style={{ display: 'block', objectFit: 'contain', width: '100%', height: '100%' }}
          />
        </div>
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        maxWidth: '76%',
        alignItems: isUser ? 'flex-end' : 'flex-start',
      }}>
        {/* Tool call indicators */}
        {!isUser && message.toolCalls && message.toolCalls.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {message.toolCalls.map((tc, i) => (
              <ToolCallCard key={i} toolName={tc.name} status={tc.status} />
            ))}
          </div>
        )}

        {/* Message bubble */}
        {message.content && (
          <div
            style={
              isUser
                ? {
                    background: 'var(--brand-gradient)',
                    color: '#fff',
                    borderRadius: '20px',
                    borderBottomRightRadius: '6px',
                    padding: '12px 18px',
                    fontSize: '14px',
                    lineHeight: 1.65,
                    fontWeight: 500,
                    boxShadow: '0 4px 16px rgba(0,171,231,0.22)',
                    letterSpacing: '-0.01em',
                  }
                : {
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-primary)',
                    borderRadius: '20px',
                    borderBottomLeftRadius: '6px',
                    padding: '14px 18px',
                    fontSize: '14px',
                    lineHeight: 1.75,
                    border: '1px solid var(--border-card)',
                    boxShadow: 'var(--shadow-card)',
                  }
            }
          >
            {isUser ? (
              <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{message.content}</p>
            ) : (
              <div>
                {segments!.map((seg, i) =>
                  seg.type === 'table' ? (
                    <DataTable key={i} headers={seg.headers} rows={seg.rows} />
                  ) : (
                    <div
                      key={i}
                      dangerouslySetInnerHTML={{
                        __html: `<p style="margin:0">${renderMarkdown(seg.content)}</p>`,
                      }}
                    />
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
