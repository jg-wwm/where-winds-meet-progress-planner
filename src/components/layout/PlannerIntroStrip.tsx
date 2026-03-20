import type { CSSProperties } from 'react'

interface PlannerIntroStripProps {
  activeTab: string
}

const stepStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '32px 1fr',
  gap: '10px',
  alignItems: 'start',
}

const badgeStyle: CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '999px',
  display: 'grid',
  placeItems: 'center',
  fontWeight: 800,
  color: '#18211d',
  background: 'linear-gradient(180deg, var(--wwm-gold-soft) 0%, var(--wwm-gold) 100%)',
}

export const PlannerIntroStrip = ({
  activeTab,
}: PlannerIntroStripProps) => {
  const isDashboard = activeTab === 'dashboard'

  return (
    <section
      style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '0 12px 14px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          borderRadius: '20px',
          padding: '20px',
          background:
            'linear-gradient(135deg, rgba(18,31,47,0.9) 0%, rgba(28,42,56,0.92) 55%, rgba(74,58,38,0.82) 100%)',
          border: '1px solid rgba(201,161,90,0.22)',
          boxShadow: '0 14px 34px rgba(0,0,0,0.14)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gap: '18px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            alignItems: 'start',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                padding: '5px 10px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: 'var(--wwm-gold-soft)',
                background: 'rgba(201,161,90,0.14)',
                border: '1px solid rgba(201,161,90,0.22)',
              }}
            >
              Planner quick start
            </div>

            <h2
              style={{
                margin: '12px 0 0 0',
                color: '#f8f5ee',
                fontSize: '1.45rem',
              }}
            >
              Start your build in three steps
            </h2>

            <p
              style={{
                margin: '10px 0 0 0',
                lineHeight: 1.7,
                color: 'rgba(248,245,238,0.84)',
                maxWidth: '62ch',
              }}
            >
              Enter what your character already has, then let the planner show
              what is still missing and what to farm next.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gap: '12px',
            }}
          >
            <div style={stepStyle}>
              <div style={badgeStyle}>1</div>
              <div style={{ color: 'rgba(248,245,238,0.9)', lineHeight: 1.6 }}>
                Add a character or pick one from your existing roster.
              </div>
            </div>

            <div style={stepStyle}>
              <div style={badgeStyle}>2</div>
              <div style={{ color: 'rgba(248,245,238,0.9)', lineHeight: 1.6 }}>
                In <strong>Setup</strong>, enter current skill tiers/ranks and
                your inventory.
              </div>
            </div>

            <div style={stepStyle}>
              <div style={badgeStyle}>3</div>
              <div style={{ color: 'rgba(248,245,238,0.9)', lineHeight: 1.6 }}>
                Open <strong>Planner</strong> to review material breakdown,
                iron needs, and farming priorities.
              </div>
            </div>
          </div>
        </div>

        <div
  style={{
    marginTop: '18px',
    paddingTop: '14px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(248,245,238,0.72)',
    lineHeight: 1.6,
    fontSize: '0.95rem',
  }}
>
  Use the character tabs below to open your dashboard, switch builds, or add a new character.
</div>
      </div>
    </section>
  )
}