export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  const ctaHref = isLoggedIn ? '/chat' : '/login'
  const ctaLabel = isLoggedIn ? 'Open de Chat' : 'Begin nu gratis'

  return (
    <main style={{
      background: 'var(--bg-base)',
      color: 'var(--text-primary)',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      minHeight: '100vh',
      overflowX: 'hidden',
    }}>

      {/* ── Floating Nav ───────────────────────────────────── */}
      <nav style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'calc(100% - 48px)',
        maxWidth: '960px',
        backdropFilter: 'blur(32px) saturate(200%)',
        WebkitBackdropFilter: 'blur(32px) saturate(200%)',
        background: 'rgba(5, 13, 26, 0.90)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}>
        <div style={{
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '56px',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Traininsight" style={{ height: '36px', width: 'auto', display: 'block' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isLoggedIn ? (
              <>
                <Link href="/api/auth/signout" style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'rgba(245,245,247,0.40)',
                  padding: '7px 16px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}>
                  Uitloggen
                </Link>
                <Link href="/chat" style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#fff',
                  padding: '8px 20px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  background: 'var(--brand-gradient)',
                  boxShadow: '0 2px 16px rgba(0,171,231,0.30)',
                  letterSpacing: '-0.01em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}>
                  Open Chat
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </>
            ) : (
              <Link href="/login" style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#fff',
                padding: '8px 20px',
                borderRadius: '12px',
                textDecoration: 'none',
                background: 'var(--brand-gradient)',
                boxShadow: '0 2px 16px rgba(0,171,231,0.30)',
                letterSpacing: '-0.01em',
                cursor: 'pointer',
              }}>
                Inloggen
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '148px 24px 72px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background mesh */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 90% 70% at 50% -5%, rgba(0,171,231,0.16) 0%, transparent 65%),
            radial-gradient(ellipse 50% 50% at 20% 65%, rgba(0,81,194,0.09) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 80% 40%, rgba(0,171,231,0.07) 0%, transparent 60%)
          `,
        }} />
        {/* Noise texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        <div style={{ position: 'relative', maxWidth: '820px', margin: '0 auto' }}>

          {/* Eyebrow badge */}
          <div className="animate-fade-in-up" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
            padding: '5px 14px 5px 6px',
            borderRadius: '980px',
            border: '1px solid rgba(0,171,231,0.22)',
            background: 'rgba(0,171,231,0.07)',
          }}>
            <span style={{
              padding: '3px 10px',
              borderRadius: '980px',
              background: 'var(--brand-gradient)',
              fontSize: '10px',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
            }}>Nieuw</span>
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(245,245,247,0.60)' }}>
              AI-assistent voor Trainin-ondernemers
            </span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-up delay-100 font-display"
            style={{
              fontSize: 'clamp(52px, 9vw, 96px)',
              fontWeight: 800,
              lineHeight: 0.95,
              marginBottom: '12px',
              fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.01em',
            }}
          >
            <span style={{ color: '#f5f5f7' }}>VRAAG ALLES<br />OVER JE</span>{' '}
            <span className="shimmer-text">BEDRIJF.</span>
          </h1>

          {/* Sub-headline */}
          <p
            className="animate-fade-in-up delay-200"
            style={{
              fontSize: '18px',
              fontWeight: 400,
              lineHeight: 1.7,
              color: 'rgba(245,245,247,0.50)',
              maxWidth: '500px',
              margin: '24px auto 44px',
            }}
          >
            Stel vragen in gewoon Nederlands en krijg direct inzicht in je omzet,
            klanten en boekingen — rechtstreeks uit Trainin.
          </p>

          {/* CTA */}
          <div className="animate-fade-in-up delay-300" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '72px' }}>
            {isLoggedIn ? (
              <Link href="/chat" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontSize: '15px', fontWeight: 700, color: '#fff',
                padding: '15px 32px', borderRadius: '16px', textDecoration: 'none',
                background: 'var(--brand-gradient)', letterSpacing: '-0.02em',
                boxShadow: '0 4px 28px rgba(0,171,231,0.35), 0 1px 3px rgba(0,0,0,0.3)',
                cursor: 'pointer',
              }}>
                Open de Chat →
              </Link>
            ) : (
              <>
                <a
                  href="https://tidycal.com/deaistrateeg/trainin"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    fontSize: '15px', fontWeight: 700, color: '#fff',
                    padding: '15px 32px', borderRadius: '16px', textDecoration: 'none',
                    background: 'var(--brand-gradient)', letterSpacing: '-0.02em',
                    boxShadow: '0 4px 28px rgba(0,171,231,0.35), 0 1px 3px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Plan een kennismaking
                </a>
                <a
                  href="https://wa.me/31645968769?text=Hoi%2C%20ik%20ben%20ge%C3%AFnteresseerd%20in%20Traininsight%20en%20wil%20graag%20meer%20weten%20over%20de%20mogelijkheden%20voor%20mijn%20Trainin-account."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    fontSize: '15px', fontWeight: 600, color: 'rgba(245,245,247,0.80)',
                    padding: '14px 24px', borderRadius: '16px', textDecoration: 'none',
                    border: '1px solid rgba(37,211,102,0.30)', background: 'rgba(37,211,102,0.08)',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25d366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp ons
                </a>
              </>
            )}
            <a href="#hoe-het-werkt" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontSize: '15px', fontWeight: 600, color: 'rgba(245,245,247,0.55)',
              padding: '14px 24px', borderRadius: '16px', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.03)',
              cursor: 'pointer',
            }}>
              Hoe het werkt
            </a>
          </div>

          {/* Chat preview mockup */}
          <div className="animate-scale-in delay-400 animate-float" style={{ maxWidth: '580px', margin: '0 auto' }}>
            <div style={{
              background: 'linear-gradient(145deg, #0e1827 0%, #091220 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 60px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}>
              {/* Window chrome */}
              <div style={{
                padding: '13px 18px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(0,0,0,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#28c840' }} />
                <span style={{ flex: 1, textAlign: 'center', fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.16)', marginRight: '38px' }}>
                  Traininsight AI
                </span>
              </div>

              {/* Chat messages */}
              <div style={{ padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* User bubble */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    padding: '11px 18px',
                    borderRadius: '20px',
                    borderBottomRightRadius: '6px',
                    background: 'var(--brand-gradient)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    maxWidth: '72%',
                    lineHeight: 1.5,
                    boxShadow: '0 4px 16px rgba(0,171,231,0.25)',
                    textAlign: 'left',
                  }}>
                    Hoeveel omzet heb ik deze maand?
                  </div>
                </div>

                {/* Tool call badge */}
                <div style={{ display: 'flex', paddingLeft: '38px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    borderRadius: '10px',
                    background: 'rgba(0,171,231,0.07)',
                    border: '1px solid rgba(0,171,231,0.14)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#00abe7',
                    letterSpacing: '0.01em',
                  }}>
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Bestellingen opgehaald via Trainin API
                  </div>
                </div>

                {/* AI bubble */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                  <div style={{ width: '62px', height: '34px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: 'rgba(0,171,231,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image src="/favicon.svg" alt="Traininsight" width={62} height={34} style={{ display: 'block', objectFit: 'contain' }} />
                  </div>
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: '20px',
                    borderBottomLeftRadius: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    maxWidth: '78%',
                    lineHeight: 1.7,
                    textAlign: 'left',
                  }}>
                    <p>Je omzet deze maand is <strong style={{ color: '#00f2f6', fontWeight: 700 }}>€ 12.450</strong></p>
                    <p style={{ marginTop: '6px', color: 'rgba(245,245,247,0.50)', fontSize: '13px' }}>
                      Gebaseerd op <strong style={{ color: '#f5f5f7', fontWeight: 600 }}>47 bestellingen</strong>. Dat is
                      <strong style={{ color: '#00f2f6', fontWeight: 600 }}> +14%</strong> t.o.v. vorige maand.
                    </p>
                  </div>
                </div>
              </div>

              {/* Input bar */}
              <div style={{ padding: '12px 18px 18px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '11px 14px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}>
                  <span style={{ flex: 1, fontSize: '13px', color: 'rgba(255,255,255,0.20)', textAlign: 'left' }}>
                    Stel een vraag over je bedrijf...
                  </span>
                  <div style={{
                    width: '30px', height: '30px',
                    borderRadius: '9px',
                    background: 'var(--brand-gradient)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,171,231,0.28)',
                    flexShrink: 0,
                  }}>
                    <svg width="13" height="13" fill="none" stroke="white" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────── */}
      <section style={{ maxWidth: '880px', margin: '0 auto', padding: '0 24px 96px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(255,255,255,0.025)',
        }}>
          {[
            { number: '< 3s', label: 'Antwoord binnen 3 seconden', icon: '⚡' },
            { number: '100%', label: 'Live data uit Trainin', icon: '🔗' },
            { number: 'NL', label: 'Volledig in het Nederlands', icon: '🇳🇱' },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              padding: '32px 20px',
              textAlign: 'center',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <div className="brand-gradient-text" style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '40px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                marginBottom: '8px',
              }}>
                {stat.number}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 400, lineHeight: 1.4 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Hoe het werkt ───────────────────────────────────── */}
      <section id="hoe-het-werkt" style={{ maxWidth: '880px', margin: '0 auto', padding: '0 24px 120px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00abe7', marginBottom: '14px' }}>
            Simpel & Snel
          </p>
          <h2 style={{
            fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(36px, 6vw, 60px)',
            fontWeight: 800,
            letterSpacing: '-0.01em',
            lineHeight: 1.05,
            color: '#f5f5f7',
          }}>
            HOE HET WERKT
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {[
            {
              step: 1,
              title: 'Neem contact op',
              body: 'Stuur ons een bericht en wij regelen de volledige koppeling met jouw Trainin account. Jij hoeft niets technisch te doen.',
              icon: (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#00abe7" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
            },
            {
              step: 2,
              title: 'Stel je vraag',
              body: 'Typ in gewoon Nederlands wat je wilt weten. Geen filters, geen rapporten — gewoon een vraag zoals aan een collega.',
              icon: (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#00abe7" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              ),
            },
            {
              step: 3,
              title: 'Ontvang inzicht',
              body: 'De AI haalt live data op uit Trainin en geeft je direct een helder, actionabel antwoord — inclusief tabellen en grafieken.',
              icon: (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#00abe7" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
            },
          ].map((item, idx) => (
            <div key={item.step} style={{
              padding: '36px 32px',
              background: 'var(--bg-base)',
              position: 'relative',
            }}>
              {/* Step number */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'var(--brand-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#fff',
                }}>
                  {item.step}
                </div>
                <div style={{
                  width: '36px', height: '36px',
                  borderRadius: '12px',
                  background: 'rgba(0,171,231,0.08)',
                  border: '1px solid rgba(0,171,231,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {item.icon}
                </div>
              </div>
              <h3 style={{
                fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif",
                fontSize: '22px',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                marginBottom: '10px',
                color: '#f5f5f7',
                textTransform: 'uppercase',
              }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'rgba(245,245,247,0.45)' }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bento Grid Features ──────────────────────────────── */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 120px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00abe7', marginBottom: '14px' }}>
            Mogelijkheden
          </p>
          <h2 style={{
            fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(36px, 6vw, 60px)',
            fontWeight: 800,
            letterSpacing: '-0.01em',
            lineHeight: 1.05,
            color: '#f5f5f7',
          }}>
            ALLES WAT JE NODIG HEBT.<br />
            <span style={{ color: 'rgba(245,245,247,0.28)' }}>NIETS MEER, NIETS MINDER.</span>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '14px',
        }}>
          {/* Card 1 — large left: Natural language */}
          <div className="card-hover" style={{
            gridColumn: '1 / 4',
            gridRow: '1 / 2',
            background: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-card)',
            padding: '36px 36px 32px',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer',
          }}>
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: '220px', height: '220px',
              background: 'radial-gradient(ellipse, rgba(0,171,231,0.09) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              width: '46px', height: '46px',
              borderRadius: '14px',
              background: 'rgba(0,171,231,0.10)',
              border: '1px solid rgba(0,171,231,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '22px',
            }}>
              <svg width="21" height="21" fill="none" viewBox="0 0 24 24" stroke="#00abe7" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '10px', color: '#f5f5f7' }}>
              Vraag in gewoon Nederlands
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'rgba(245,245,247,0.45)' }}>
              Geen dashboards, filters of rapporten. Stel vragen zoals je dat bij een collega zou doen. De AI begrijpt de context van jouw bedrijf.
            </p>
          </div>

          {/* Card 2 — right: Direct answer */}
          <div className="card-hover" style={{
            gridColumn: '4 / 7',
            gridRow: '1 / 2',
            background: 'linear-gradient(140deg, rgba(0,171,231,0.09) 0%, rgba(0,81,194,0.07) 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(0,171,231,0.16)',
            padding: '36px 36px 32px',
            boxShadow: 'var(--shadow-card)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
          }}>
            <div style={{
              width: '46px', height: '46px',
              borderRadius: '14px',
              background: 'rgba(0,171,231,0.12)',
              border: '1px solid rgba(0,171,231,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '22px',
            }}>
              <svg width="21" height="21" fill="none" viewBox="0 0 24 24" stroke="#00abe7" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '10px', color: '#f5f5f7' }}>
              Direct antwoord
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'rgba(245,245,247,0.45)' }}>
              De AI haalt automatisch de juiste data op uit jouw Trainin account. Geen wachten, geen handmatige exports.
            </p>
            <div style={{
              marginTop: '24px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '12px',
              background: 'rgba(0,171,231,0.08)',
              border: '1px solid rgba(0,171,231,0.16)',
            }}>
              <span style={{ fontSize: '20px', fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", color: '#00f2f6', letterSpacing: '-0.02em' }}>+14%</span>
              <span style={{ fontSize: '12px', color: 'rgba(245,245,247,0.45)', fontWeight: 500 }}>t.o.v. vorige maand</span>
            </div>
          </div>

          {/* Card 3 — bottom left: Security */}
          <div className="card-hover" style={{
            gridColumn: '1 / 3',
            gridRow: '2 / 3',
            background: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-card)',
            padding: '28px 28px 26px',
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer',
          }}>
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '13px',
              background: 'rgba(0,171,231,0.08)',
              border: '1px solid rgba(0,171,231,0.14)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '18px',
            }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#00abe7" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '8px', color: '#f5f5f7' }}>
              Veilig &amp; privé
            </h3>
            <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(245,245,247,0.40)' }}>
              Je credentials worden versleuteld opgeslagen. Data blijft altijd van jou.
            </p>
          </div>

          {/* Card 4 — bottom center: History */}
          <div className="card-hover" style={{
            gridColumn: '3 / 5',
            gridRow: '2 / 3',
            background: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-card)',
            padding: '28px 28px 26px',
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer',
          }}>
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '13px',
              background: 'rgba(124,58,237,0.10)',
              border: '1px solid rgba(124,58,237,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '18px',
            }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#7c3aed" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '8px', color: '#f5f5f7' }}>
              Gesprekshistorie
            </h3>
            <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(245,245,247,0.40)' }}>
              Alle gesprekken worden automatisch opgeslagen zodat je altijd kunt terugkijken.
            </p>
          </div>

          {/* Card 5 — bottom right: Tables */}
          <div className="card-hover" style={{
            gridColumn: '5 / 7',
            gridRow: '2 / 3',
            background: 'linear-gradient(140deg, rgba(0,171,231,0.06) 0%, rgba(0,81,194,0.04) 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(0,171,231,0.13)',
            padding: '28px 28px 26px',
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer',
          }}>
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '13px',
              background: 'rgba(0,171,231,0.10)',
              border: '1px solid rgba(0,171,231,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '18px',
            }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#00abe7" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '8px', color: '#f5f5f7' }}>
              Tabellen &amp; CSV
            </h3>
            <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(245,245,247,0.40)' }}>
              AI-antwoorden met tabellen exporteer je direct naar CSV voor verdere analyse.
            </p>
          </div>
        </div>
      </section>

      {/* ── Example questions ───────────────────────────────── */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 120px' }}>
        <div style={{
          padding: '44px 48px',
          background: 'rgba(0,171,231,0.03)',
          border: '1px solid rgba(0,171,231,0.10)',
          borderRadius: '28px',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ marginBottom: '28px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00abe7', marginBottom: '10px' }}>
              Voorbeeldvragen
            </p>
            <h3 style={{
              fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif",
              fontSize: '28px',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: '#f5f5f7',
              textTransform: 'uppercase',
            }}>
              WAT KUN JE VRAGEN?
            </h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              'Hoeveel omzet deze maand?',
              'Welke klanten dreigen weg te lopen?',
              'Wat is mijn churn rate?',
              'Bereken mijn gemiddelde LTV',
              'Vergelijk omzet met vorige maand',
              'Geef me een cohortanalyse',
              'Wie zijn mijn beste klanten?',
              'Drukste lestijden op dinsdag?',
              'Hoogste bezettingsgraad per coach?',
              'Mijn top 5 pakketten dit kwartaal',
              'Hoeveel nieuwe leden deze week?',
              'Wat is mijn gemiddelde orderwaarde?',
            ].map((q) => (
              <span key={q} className="pill-tag">
                &ldquo;{q}&rdquo;
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────── */}
      <section style={{
        textAlign: 'center',
        padding: '100px 24px 120px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 70% 70% at 50% 110%, rgba(0,171,231,0.12) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 30% 50%, rgba(0,81,194,0.06) 0%, transparent 60%)
          `,
        }} />
        <div style={{ position: 'relative', maxWidth: '580px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00abe7', marginBottom: '20px' }}>
            Interesse?
          </p>
          <h2 style={{
            fontFamily: "'Barlow Condensed', 'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(40px, 7vw, 72px)',
            fontWeight: 800,
            letterSpacing: '-0.01em',
            color: '#f5f5f7',
            lineHeight: 1.0,
            marginBottom: '20px',
            textTransform: 'uppercase',
          }}>
            WIJ REGELEN DE<br />VOLLEDIGE SETUP.
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(245,245,247,0.40)', marginBottom: '44px', lineHeight: 1.65 }}>
            Jij krijgt van ons een persoonlijke inlog — wij regelen de volledige koppeling
            met jouw Trainin-account. Plan een gratis kennismakingsgesprek of stuur ons een WhatsApp.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Plan een gesprek */}
            <a
              href="https://tidycal.com/deaistrateeg/trainin"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '16px',
                fontWeight: 700,
                color: '#fff',
                padding: '16px 32px',
                borderRadius: '18px',
                textDecoration: 'none',
                background: 'var(--brand-gradient)',
                letterSpacing: '-0.02em',
                boxShadow: '0 4px 36px rgba(0,171,231,0.40), 0 1px 3px rgba(0,0,0,0.4)',
                cursor: 'pointer',
              }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Plan een kennismaking
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/31645968769?text=Hoi%2C%20ik%20ben%20ge%C3%AFnteresseerd%20in%20Traininsight%20en%20wil%20graag%20meer%20weten%20over%20de%20mogelijkheden%20voor%20mijn%20Trainin-account."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '16px',
                fontWeight: 700,
                color: '#fff',
                padding: '16px 32px',
                borderRadius: '18px',
                textDecoration: 'none',
                background: 'rgba(37,211,102,0.15)',
                border: '1px solid rgba(37,211,102,0.35)',
                letterSpacing: '-0.02em',
                cursor: 'pointer',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#25d366' }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp ons
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '24px 24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(245,245,247,0.35)', fontWeight: 400 }}>
            Een initiatief van
          </p>
          <a
            href="https://deaistrateeg.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-logo-link"
          >
            <Image
              src="/deaistrateeg-logo.png"
              alt="De AI Strateeg"
              width={96}
              height={24}
              style={{ display: 'block', filter: 'invert(1)', opacity: 0.7 }}
            />
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(245,245,247,0.20)' }}>
            © {new Date().getFullYear()} · Alle rechten voorbehouden
          </p>
          <Link href="/admin" style={{
            fontSize: '11px',
            color: 'rgba(245,245,247,0.12)',
            textDecoration: 'none',
            padding: '4px 8px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            Admin
          </Link>
        </div>
      </footer>

    </main>
  )
}
