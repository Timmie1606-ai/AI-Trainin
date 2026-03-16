'use client'

export default function TrialExpired() {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center"
      style={{ background: 'var(--bg-base)', padding: '40px 24px' }}
    >
      <div style={{ width: '100%', maxWidth: '480px', textAlign: 'center' }}>

        {/* Icon */}
        <div style={{
          width: '56px', height: '56px',
          borderRadius: '18px',
          background: 'rgba(251,191,36,0.08)',
          border: '1px solid rgba(251,191,36,0.20)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <svg width="24" height="24" fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Heading */}
        <h2 style={{
          fontSize: '22px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
          marginBottom: '12px',
        }}>
          Je proefperiode is verlopen
        </h2>

        <p style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
          marginBottom: '32px',
          maxWidth: '380px',
          margin: '0 auto 32px',
        }}>
          Je gratis proefperiode van 7 dagen is afgelopen. Neem contact op om verder gebruik te maken van Traininsight.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <a
            href="https://tidycal.com/deaistrateeg/trainin"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 28px',
              borderRadius: '14px',
              background: 'var(--brand-gradient)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              boxShadow: '0 4px 20px rgba(0,171,231,0.30)',
              width: '100%',
              maxWidth: '320px',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Plan een gesprek in
          </a>

          <a
            href="https://wa.me/31645968769?text=Hoi%2C%20mijn%20proefperiode%20van%20Traininsight%20is%20verlopen.%20Ik%20wil%20graag%20verder%20gebruik%20maken."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 28px',
              borderRadius: '14px',
              background: 'rgba(37,211,102,0.08)',
              color: '#25d366',
              fontWeight: 600,
              fontSize: '15px',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              border: '1px solid rgba(37,211,102,0.20)',
              width: '100%',
              maxWidth: '320px',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp ons
          </a>
        </div>

        {/* Footer note */}
        <p style={{
          marginTop: '28px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
        }}>
          Vragen? Stuur een e-mail naar{' '}
          <a href="mailto:info@deaistrateeg.nl" style={{ color: '#00abe7', textDecoration: 'none' }}>
            info@deaistrateeg.nl
          </a>
        </p>
      </div>
    </div>
  )
}
