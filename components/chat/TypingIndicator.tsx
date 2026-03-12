import Image from 'next/image'

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      <div className="flex-shrink-0 rounded-lg overflow-hidden" style={{ width: '36px', height: '36px' }}>
        <Image src="/traininsight-favicon.svg" alt="Traininsight" width={36} height={36} style={{ display: 'block', objectFit: 'cover', width: '100%', height: '100%' }} />
      </div>
      <div
        className="px-4 py-3 rounded-2xl"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderBottomLeftRadius: '6px',
        }}
      >
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{
                background: 'var(--text-muted)',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
