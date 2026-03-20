interface FooterProps {
  onOpenPrivacy: () => void
  onOpenPlanner: () => void
  showBackToPlanner?: boolean
}

export const Footer = ({
  onOpenPrivacy,
  onOpenPlanner,
  showBackToPlanner = false,
}: FooterProps) => {
  return (
    <footer
      style={{
        marginTop: '28px',
        borderTop: '1px solid rgba(201,161,90,0.14)',
        background:
          'linear-gradient(180deg, rgba(6,15,26,0.9) 0%, rgba(9,18,31,0.94) 100%)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '22px 12px 26px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'grid',
            gap: '18px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            alignItems: 'start',
          }}
        >
          <div>
            <div
              style={{
                color: '#f8f5ee',
                fontWeight: 700,
                fontSize: '1.15rem',
              }}
            >
              Where Winds Meet Progress Planner
            </div>

            <div
              style={{
                marginTop: '8px',
                color: 'rgba(248,245,238,0.8)',
                lineHeight: 1.7,
                maxWidth: '58ch',
              }}
            >
              Unofficial fan-made progression planner for the Where Winds Meet
              community, built for cleaner tracking, better farming decisions,
              and multi-character planning.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'flex-start',
            }}
          >
            <button
              type="button"
              onClick={onOpenPlanner}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '42px',
                padding: '0 16px',
                borderRadius: '999px',
                border: '1px solid rgba(201,161,90,0.2)',
                background: showBackToPlanner
                  ? 'linear-gradient(180deg, var(--wwm-gold-soft) 0%, var(--wwm-gold) 100%)'
                  : 'rgba(255,255,255,0.06)',
                color: showBackToPlanner ? '#18211d' : '#f8f5ee',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {showBackToPlanner ? 'Back to Planner' : 'Open Planner'}
            </button>

            <button
              type="button"
              onClick={onOpenPrivacy}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '42px',
                padding: '0 16px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
                color: '#f8f5ee',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Privacy Policy
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: '18px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(248,245,238,0.58)',
            fontSize: '0.92rem',
            lineHeight: 1.6,
          }}
        >
          Unofficial fan-made project. Not affiliated with or endorsed by the
          developers, publishers, or rights holders of Where Winds Meet.
        </div>
      </div>
    </footer>
  )
}