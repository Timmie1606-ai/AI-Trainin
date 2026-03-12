export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  return (
    <main style={{
      background: 'var(--bg-base)',
      color: 'var(--text-primary)',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
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
        backdropFilter: 'blur(28px) saturate(200%)',
        WebkitBackdropFilter: 'blur(28px) saturate(200%)',
        background: 'rgba(10, 12, 18, 0.82)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}>
        <div style={{
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image src="/trainin-logo-cropped.svg" alt="Traininsight" width={188} height={70} priority style={{ display: 'block', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isLoggedIn ? (
              <>
                <Link href="/api/auth/signout" style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'rgba(245,245,247,0.45)',
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
                  boxShadow: '0 2px 12px rgba(0,200,190,0.28)',
                  letterSpacing: '-0.01em',
                }}>
                  Open Chat →
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
                boxShadow: '0 2px 12px rgba(0,200,190,0.28)',
                letterSpacing: '-0.01em',
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
        padding: '140px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background mesh */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,200,190,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 20% 60%, rgba(46,191,142,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 80% 40%, rgba(0,200,190,0.05) 0%, transparent 60%)
          `,
        }} />

        {/* Noise texture overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
          {/* Eyebrow badge */}
          <div
            className="animate-fade-in-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '28px',
              padding: '6px 16px 6px 8px',
              borderRadius: '980px',
              border: '1px solid rgba(0,200,190,0.20)',
              background: 'rgba(0,200,190,0.06)',
            }}
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 10px',
              borderRadius: '980px',
              background: 'var(--brand-gradient)',
              fontSize: '10px',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              Nieuw
            </span>
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(245,245,247,0.6)' }}>
              Traininsight — AI voor Trainin-ondernemers
            </span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-up delay-100"
            style={{
              fontSize: 'clamp(48px, 8vw, 88px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              marginBottom: '28px',
            }}
          >
            <span style={{ color: '#f5f5f7' }}>Vraag alles over<br /></span>
            <span className="shimmer-text">je bedrijfsdata.</span>
          </h1>

          {/* Subheading */}
          <p
            className="animate-fade-in-up delay-200"
            style={{
              fontSize: '18px',
              fontWeight: 400,
              lineHeight: 1.7,
              color: 'rgba(245,245,247,0.50)',
              marginBottom: '44px',
              maxWidth: '520px',
              margin: '0 auto 44px',
            }}
          >
            Stel vragen in gewoon Nederlands. Krijg direct inzicht in je omzet, klanten en boekingen — rechtstreeks uit Trainin.
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-in-up delay-300"
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '80px',
            }}
          >
            {isLoggedIn ? (
              <Link href="/chat" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                fontWeight: 700,
                color: '#fff',
                padding: '15px 32px',
                borderRadius: '16px',
                textDecoration: 'none',
                background: 'var(--brand-gradient)',
                letterSpacing: '-0.02em',
                boxShadow: '0 4px 24px rgba(0,200,190,0.30), 0 1px 3px rgba(0,0,0,0.3)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}>
                Open de Chat
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <Link href="/login" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                fontWeight: 700,
                color: '#fff',
                padding: '15px 32px',
                borderRadius: '16px',
                textDecoration: 'none',
                background: 'var(--brand-gradient)',
                letterSpacing: '-0.02em',
                boxShadow: '0 4px 24px rgba(0,200,190,0.30), 0 1px 3px rgba(0,0,0,0.3)',
              }}>
                Inloggen
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>

          {/* Chat preview mockup */}
          <div
            className="animate-scale-in delay-400 animate-float"
            style={{
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <div style={{
              background: 'linear-gradient(145deg, #111520 0%, #0c0f18 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 60px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}>
              {/* Window chrome */}
              <div style={{
                padding: '14px 18px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
              }}>
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#28c840' }} />
                <span style={{ flex: 1, textAlign: 'center', fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.18)', marginRight: '38px' }}>
                  Traininsight
                </span>
              </div>

              {/* Chat messages */}
              <div style={{ padding: '28px 22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
                    boxShadow: '0 4px 16px rgba(0,200,190,0.25)',
                  }}>
                    Hoeveel omzet heb ik deze maand?
                  </div>
                </div>

                {/* Tool call badge */}
                <div style={{ display: 'flex', paddingLeft: '38px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    background: 'rgba(0,200,190,0.07)',
                    border: '1px solid rgba(0,200,190,0.14)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#00C8BE',
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
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                    <Image src="/traininsight-favicon.svg" alt="Traininsight" width={36} height={36} style={{ display: 'block', objectFit: 'cover', width: '100%', height: '100%' }} />
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
                  }}>
                    <p>Je omzet deze maand bedraagt <strong style={{ color: '#52C87A', fontWeight: 700 }}>€ 12.450,—</strong></p>
                    <p style={{ marginTop: '6px', color: 'rgba(245,245,247,0.55)', fontSize: '13px' }}>
                      Gebaseerd op <strong style={{ color: '#f5f5f7', fontWeight: 600 }}>47 bestellingen</strong>. Ten opzichte van vorige maand is dit
                      <strong style={{ color: '#52C87A', fontWeight: 600 }}> +14%</strong>.
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
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}>
                  <span style={{ flex: 1, fontSize: '13px', color: 'rgba(255,255,255,0.22)', fontWeight: 400 }}>
                    Stel een vraag over je bedrijf...
                  </span>
                  <div style={{
                    width: '32px', height: '32px',
                    borderRadius: '10px',
                    background: 'var(--brand-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,200,190,0.28)',
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
      <section style={{
        maxWidth: '880px',
        margin: '0 auto',
        padding: '0 24px 100px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {[
            { number: '< 3s', label: 'Antwoord binnen 3 seconden' },
            { number: '100%', label: 'Live data uit Trainin' },
            { number: 'NL', label: 'Volledig in het Nederlands' },
          ].map((stat) => (
            <div key={stat.label} style={{
              padding: '32px 24px',
              background: 'rgba(255,255,255,0.02)',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                marginBottom: '6px',
              }}
              className="brand-gradient-text"
              >
                {stat.number}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 400 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bento Grid Features ──────────────────────────────── */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 120px' }}>
        {/* Section heading */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#00C8BE',
            marginBottom: '14px',
          }}>
            Mogelijkheden
          </p>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.1,
            color: '#f5f5f7',
          }}>
            Alles wat je nodig hebt.<br />
            <span style={{ color: 'rgba(245,245,247,0.35)' }}>Niets meer, niets minder.</span>
          </h2>
        </div>

        {/* Bento grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: 'auto auto',
          gap: '16px',
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
          }}>
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: '200px', height: '200px',
              background: 'radial-gradient(ellipse, rgba(0,200,190,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '14px',
              background: 'rgba(0,200,190,0.10)',
              border: '1px solid rgba(0,200,190,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px',
            }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#00C8BE" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '10px', color: '#f5f5f7' }}>
              Vraag in gewoon Nederlands
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'rgba(245,245,247,0.45)' }}>
              Geen dashboards, filters of rapporten. Gewoon vragen stellen zoals je dat bij een collega zou doen. De AI begrijpt de context van jouw bedrijf.
            </p>
          </div>

          {/* Card 2 — right: Direct answer */}
          <div className="card-hover" style={{
            gridColumn: '4 / 7',
            gridRow: '1 / 2',
            background: 'linear-gradient(135deg, rgba(0,200,190,0.08) 0%, rgba(46,191,142,0.06) 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(0,200,190,0.14)',
            padding: '36px 36px 32px',
            boxShadow: 'var(--shadow-card)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '14px',
              background: 'rgba(0,200,190,0.12)',
              border: '1px solid rgba(0,200,190,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px',
            }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#00C8BE" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '10px', color: '#f5f5f7' }}>
              Direct antwoord
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'rgba(245,245,247,0.45)' }}>
              De AI haalt automatisch de juiste data op uit jouw Trainin account. Geen wachten, geen handmatige exports.
            </p>

            {/* Decorative stat */}
            <div style={{
              marginTop: '24px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '12px',
              background: 'rgba(0,229,190,0.08)',
              border: '1px solid rgba(0,229,190,0.15)',
            }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#52C87A', letterSpacing: '-0.04em' }}>+14%</span>
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
            padding: '30px 30px 28px',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '14px',
              background: 'rgba(0,200,190,0.08)',
              border: '1px solid rgba(0,200,190,0.14)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#00C8BE" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '8px', color: '#f5f5f7' }}>
              Veilig & privé
            </h3>
            <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(245,245,247,0.40)' }}>
              Jouw Trainin-koppeling wordt veilig beheerd. Alle data blijft versleuteld en altijd van jou.
            </p>
          </div>

          {/* Card 4 — bottom center: History */}
          <div className="card-hover" style={{
            gridColumn: '3 / 5',
            gridRow: '2 / 3',
            background: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-card)',
            padding: '30px 30px 28px',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '14px',
              background: 'rgba(124,58,237,0.10)',
              border: '1px solid rgba(124,58,237,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#7c3aed" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '8px', color: '#f5f5f7' }}>
              Gesprekshistorie
            </h3>
            <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(245,245,247,0.40)' }}>
              Alle gesprekken worden opgeslagen zodat je altijd terug kunt kijken.
            </p>
          </div>

          {/* Card 5 — bottom right: Tables */}
          <div className="card-hover" style={{
            gridColumn: '5 / 7',
            gridRow: '2 / 3',
            background: 'linear-gradient(135deg, rgba(0,229,190,0.06) 0%, rgba(0,200,190,0.04) 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(0,229,190,0.12)',
            padding: '30px 30px 28px',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '14px',
              background: 'rgba(0,229,190,0.10)',
              border: '1px solid rgba(0,229,190,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#52C87A" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '8px', color: '#f5f5f7' }}>
              Tabellen & CSV
            </h3>
            <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(245,245,247,0.40)' }}>
              AI-antwoorden met tabellen exporteer je direct naar CSV.
            </p>
          </div>

        </div>
      </section>

      {/* ── Example questions ───────────────────────────────── */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 120px' }}>
        <div style={{
          padding: '44px 48px',
          background: 'rgba(0,200,190,0.03)',
          border: '1px solid rgba(0,200,190,0.10)',
          borderRadius: '28px',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00C8BE', marginBottom: '8px' }}>
                Voorbeeldvragen
              </p>
              <h3 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em', color: '#f5f5f7' }}>
                Wat kun je vragen?
              </h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              'Hoeveel omzet deze maand?',
              'Welke klant boekt het meest?',
              'Hoeveel nieuwe leden deze week?',
              'Drukste lestijden op dinsdag?',
              'Welke klanten dreigen weg te lopen?',
              'Vergelijk omzet met vorige maand',
              'Hoeveel sessies staan er ingepland?',
              'Mijn top 5 producten dit kwartaal',
              'Wat is mijn churn rate?',
              'Bereken mijn gemiddelde LTV',
            ].map((q) => (
              <span key={q} style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'rgba(245,245,247,0.45)',
                padding: '8px 16px',
                borderRadius: '980px',
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.03)',
                letterSpacing: '-0.01em',
                transition: 'all 0.15s ease',
                cursor: 'default',
              }}>
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
          background: 'radial-gradient(ellipse 60% 60% at 50% 100%, rgba(0,200,190,0.10) 0%, transparent 70%)',
        }} />
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00C8BE', marginBottom: '20px' }}>
            Interesse?
          </p>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: '#f5f5f7',
            lineHeight: 1.1,
            marginBottom: '16px',
          }}>
            Wij regelen de volledige<br />setup voor jou.
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(245,245,247,0.40)', marginBottom: '40px', lineHeight: 1.6 }}>
            Neem contact op en wij koppelen jouw Trainin-account — jij hoeft niets technisch te doen.
          </p>
          {isLoggedIn ? (
            <Link href="/chat" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              fontWeight: 700,
              color: '#fff',
              padding: '16px 36px',
              borderRadius: '18px',
              textDecoration: 'none',
              background: 'var(--brand-gradient)',
              letterSpacing: '-0.02em',
              boxShadow: '0 4px 32px rgba(0,200,190,0.35), 0 1px 3px rgba(0,0,0,0.4)',
            }}>
              Open de Chat
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <Link href="/login" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              fontWeight: 700,
              color: '#fff',
              padding: '16px 36px',
              borderRadius: '18px',
              textDecoration: 'none',
              background: 'var(--brand-gradient)',
              letterSpacing: '-0.02em',
              boxShadow: '0 4px 32px rgba(0,200,190,0.35), 0 1px 3px rgba(0,0,0,0.4)',
            }}>
              Inloggen
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '28px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(245,245,247,0.4)', fontWeight: 400 }}>
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
              width={100}
              height={24}
              style={{ display: 'block', filter: 'invert(1)' }}
            />
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(245,245,247,0.22)' }}>
            © {new Date().getFullYear()} · Alle rechten voorbehouden
          </p>
          <Link href="/admin" style={{
            fontSize: '11px',
            color: 'rgba(245,245,247,0.15)',
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
