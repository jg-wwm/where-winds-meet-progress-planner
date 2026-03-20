import { Link } from 'react-router-dom'

const featureCards = [
  {
    title: 'Progress Planner',
    status: 'Available now',
    description:
      'Track each mystic skill from current tier and rank to your target build, with inventory-aware totals and remaining materials still needed.',
    href: '/planner',
  },
  {
    title: 'Timers',
    status: 'Coming soon',
    description:
      'Keep farming loops, route timings, and event cadence in one place so progression planning and execution live together.',
  },
  {
    title: 'Checklist',
    status: 'Coming soon',
    description:
      'Stay on top of dailies, weekly goals, and character-specific progression tasks without juggling notes across multiple places.',
  },
  {
    title: 'Resources',
    status: 'Later',
    description:
      'Curated community links, references, and planning resources to support build decisions without turning the site into a copy of anything else.',
  },
]

const quickSteps = [
  'Open the planner and create or select a character.',
  'Enter your current skill tiers, ranks, and inventory.',
  'Set the build you want to reach.',
  'Use the dashboard, farming queue, material breakdown, and iron planner to see what to farm next.',
]

export function HomePage() {
  return (
    <div
      style={{
        display: 'grid',
        gap: '24px',
      }}
    >
<section
  style={{
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '24px',
    padding: '28px',
    background:
      'linear-gradient(135deg, rgba(27,48,43,0.95) 0%, rgba(35,52,47,0.98) 45%, rgba(60,45,28,0.95) 100%)',
    border: '1px solid var(--wwm-border-strong)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
  }}
>
  <div
    style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background:
        'radial-gradient(circle at top right, rgba(201,161,90,0.16), transparent 30%), radial-gradient(circle at left center, rgba(79,155,130,0.16), transparent 35%)',
    }}
  />

  <div
    style={{
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '22px',
      alignItems: 'start',
    }}
  >
    <div
      style={{
        display: 'grid',
        gap: '18px',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          width: 'fit-content',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'var(--wwm-gold-soft)',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        Progression-first WWM planning hall
      </div>

      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
            lineHeight: 1.06,
            color: '#f8f5ee',
            maxWidth: '12ch',
          }}
        >
          Where Winds Meet Progress Planner
        </h1>

        <p
          style={{
            margin: '14px 0 0 0',
            fontSize: '1.05rem',
            lineHeight: 1.75,
            color: 'rgba(248,245,238,0.9)',
            maxWidth: '60ch',
          }}
        >
          A progression-first planner for players who want to track what they
          have, what they still need, and what to farm next — without manually
          piecing it together across spreadsheets, notes, and half-remembered
          resource counts.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <Link
          to="/planner"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '44px',
            padding: '0 18px',
            borderRadius: '999px',
            textDecoration: 'none',
            fontWeight: 700,
            color: '#18211d',
            background:
              'linear-gradient(180deg, var(--wwm-gold-soft) 0%, var(--wwm-gold) 100%)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
          }}
        >
          Enter the Planner
        </Link>

        <button
          type="button"
          onClick={() => {
            document.getElementById('start-here')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '44px',
            padding: '0 18px',
            borderRadius: '999px',
            textDecoration: 'none',
            fontWeight: 700,
            color: '#f8f5ee',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            cursor: 'pointer',
          }}
        >
          How It Works
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
        }}
      >
        {[
          'Inventory-aware planning',
          'Remaining materials needed',
          'Remaining iron needed',
          'Farming priority queue',
          'Dashboard summary',
          'Multi-character workflow',
        ].map((item) => (
          <div
            key={item}
            style={{
              borderRadius: '14px',
              padding: '12px 14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(248,245,238,0.9)',
              fontSize: '0.95rem',
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>

    <div
      style={{
        borderRadius: '20px',
        padding: '22px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(6px)',
      }}
    >
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
        Available now
      </div>

      <h2
        style={{
          margin: '14px 0 0 0',
          color: '#f8f5ee',
          fontSize: '1.45rem',
        }}
      >
        What you can do right now
      </h2>

      <div
        style={{
          display: 'grid',
          gap: '12px',
          marginTop: '16px',
          color: 'rgba(248,245,238,0.9)',
          lineHeight: 1.65,
        }}
      >
        <div>Track current tier/rank against your target build.</div>
        <div>Subtract inventory already on hand from what you still need.</div>
        <div>See remaining iron needs and farming priorities at a glance.</div>
        <div>Manage multiple characters and alternate builds in one place.</div>
      </div>

      <div
        style={{
          marginTop: '18px',
          padding: '14px 16px',
          borderRadius: '14px',
          background: 'rgba(0,0,0,0.16)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(248,245,238,0.86)',
          lineHeight: 1.6,
        }}
      >
        Built for actual day-to-day progression planning — not just a one-time
        calculator.
      </div>
    </div>
  </div>
</section>

      <section
        style={{
          display: 'grid',
          gap: '18px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        <div
          style={{
            borderRadius: '20px',
            padding: '24px',
            background: 'rgba(244, 242, 236, 0.96)',
            border: '1px solid var(--wwm-border)',
          }}
        >
          <h2
            style={{
              margin: 0,
              color: 'var(--wwm-panel)',
              fontSize: '1.5rem',
            }}
          >
            What this site helps with
          </h2>

          <div
            style={{
              display: 'grid',
              gap: '12px',
              marginTop: '16px',
            }}
          >
            {[
              {
                title: 'Plan toward a real target build',
                text: 'Track current tier and rank against where you actually want the skill to end up.',
              },
              {
                title: 'See what your inventory already covers',
                text: 'Your stock on hand matters. The planner is built to account for what you already own before telling you what is still missing.',
              },
              {
                title: 'Know what to farm next',
                text: 'Use the farming queue, material breakdown, and iron planner to stop guessing which grind matters most right now.',
              },
              {
                title: 'Manage alts without chaos',
                text: 'Switch between characters and alternate builds without losing the thread of what each one still needs.',
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  borderRadius: '16px',
                  padding: '16px',
                  background: 'rgba(255,255,255,0.76)',
                  border: '1px solid var(--wwm-border)',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: 'var(--wwm-panel)',
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    marginTop: '6px',
                    lineHeight: 1.6,
                    color: 'rgba(35,52,47,0.86)',
                  }}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
  id="start-here"
  style={{
    borderRadius: '20px',
    padding: '24px',
    background:
      'linear-gradient(180deg, rgba(16,28,40,0.82) 0%, rgba(28,42,56,0.86) 100%)',
    border: '1px solid rgba(201,161,90,0.22)',
    backdropFilter: 'blur(8px)',
    scrollMarginTop: '140px',
    boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
  }}
>
          <h2
  style={{
    margin: 0,
    color: '#f8f5ee',
    fontSize: '1.5rem',
  }}
>
  How to use the planner
</h2>

          <div
            style={{
              display: 'grid',
              gap: '12px',
              marginTop: '16px',
            }}
          >
            {quickSteps.map((step, index) => (
              <div
                key={step}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '34px 1fr',
                  gap: '12px',
                  alignItems: 'start',
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '999px',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 800,
                    color: '#18211d',
                    background:
                      'linear-gradient(180deg, var(--wwm-gold-soft) 0%, var(--wwm-gold) 100%)',
                  }}
                >
                  {index + 1}
                </div>
                <div
                  style={{
                    paddingTop: '5px',
                    lineHeight: 1.6,
                    color: 'rgba(248,245,238,0.9)',
                  }}
                >
                  {step}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '20px',
              padding: '14px 16px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(248,245,238,0.86)',
              lineHeight: 1.6,
            }}
          >
            Your planner data is meant to stay practical and personal:
            import/export is available, auto-save is built in, and this is
            designed for actual day-to-day progression tracking rather than a
            one-time calculator.
          </div>
        </div>
      </section>

      <section
  style={{
    display: 'grid',
    gap: '16px',
    position: 'relative',
    zIndex: 1,
  }}
>
  <div
    style={{
      borderRadius: '20px',
      padding: '22px 24px',
      background: 'rgba(15, 23, 42, 0.72)',
      border: '1px solid rgba(201,161,90,0.16)',
      backdropFilter: 'blur(8px)',
    }}
  >
    <h2
      style={{
        margin: 0,
        color: '#f8f5ee',
        fontSize: '1.5rem',
      }}
    >
      Planning tools in this hall
    </h2>
    <p
      style={{
        margin: '8px 0 0 0',
        color: 'rgba(248,245,238,0.8)',
        lineHeight: 1.6,
        maxWidth: '70ch',
      }}
    >
      The planner is the main live tool right now. Other pieces are planned to
      grow around it without turning the site into a generic toolbox.
    </p>
  </div>

        <div
    style={{
      display: 'grid',
      gap: '16px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      position: 'relative',
      zIndex: 2,
    }}
  >
          {featureCards.map((card) => {
      const isAvailable = card.status === 'Available now'

      return (
        <div
          key={card.title}
          style={{
            borderRadius: '20px',
            padding: '20px',
            background: 'rgba(244, 242, 236, 0.96)',
            border: '1px solid rgba(138, 114, 69, 0.22)',
            boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
          }}
        >
                <div
            style={{
              display: 'inline-flex',
              padding: '5px 10px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: isAvailable ? 'var(--wwm-jade-deep)' : '#7a6240',
              background: isAvailable
                ? 'rgba(79,155,130,0.14)'
                : 'rgba(201,161,90,0.18)',
              border: '1px solid rgba(138, 114, 69, 0.18)',
            }}
          >
            {card.status}
          </div>

                <h3
            style={{
              margin: '14px 0 0 0',
              fontSize: '1.2rem',
              color: 'var(--wwm-panel)',
            }}
          >
            {card.title}
          </h3>

                <p
            style={{
              margin: '10px 0 0 0',
              lineHeight: 1.65,
              color: 'rgba(35,52,47,0.82)',
            }}
          >
            {card.description}
          </p>

                <div style={{ marginTop: '16px' }}>
            {card.href ? (
              <Link
                to={card.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: '40px',
                  padding: '0 14px',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  color: '#18211d',
                  background:
                    'linear-gradient(180deg, var(--wwm-jade-soft) 0%, var(--wwm-jade) 100%)',
                }}
              >
                Open tool
              </Link>
                  ) : (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: '40px',
                  padding: '0 14px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  color: 'rgba(35,52,47,0.72)',
                  background: 'rgba(35,52,47,0.06)',
                  border: '1px dashed rgba(138, 114, 69, 0.3)',
                }}
              >
                Not live yet
              </span>
            )}
          </div>
        </div>
      )
    })}
  </div>
</section>

      <section
  style={{
    display: 'grid',
    gap: '16px',
  }}
>
  <div
    style={{
      borderRadius: '20px',
      padding: '22px 24px',
      background: 'rgba(15, 23, 42, 0.78)',
      border: '1px solid rgba(201,161,90,0.18)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 14px 34px rgba(0,0,0,0.14)',
    }}
  >
    <h2
      style={{
        margin: 0,
        color: '#f8f5ee',
        fontSize: '1.5rem',
      }}
    >
      Built for real progression
    </h2>

    <p
      style={{
        margin: '10px 0 0 0',
        lineHeight: 1.7,
        color: 'rgba(248,245,238,0.82)',
        maxWidth: '72ch',
      }}
    >
      This planner is meant for the part of the game where “kind of close” is
      not good enough. It helps you plan from your actual inventory, track what
      is still missing, and turn upgrade goals into a clear farming path.
    </p>
  </div>

  <div
    style={{
      display: 'grid',
      gap: '16px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    }}
  >
    {[
      {
        title: 'Track what you already own',
        text: 'Inventory is part of the plan, so the tool starts from what is already in your bag instead of pretending you have nothing.',
      },
      {
        title: 'See what is still missing',
        text: 'Material totals, iron needs, and breakdown views make it easier to understand what the build still requires.',
      },
      {
        title: 'Know what to farm next',
        text: 'The planner is built to help answer the useful question: what should I grind right now to move this character forward?',
      },
    ].map((item) => (
      <div
        key={item.title}
        style={{
          borderRadius: '20px',
          padding: '20px',
          background: 'rgba(244, 242, 236, 0.96)',
          border: '1px solid rgba(138, 114, 69, 0.22)',
          boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '1.15rem',
            color: 'var(--wwm-panel)',
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            margin: '10px 0 0 0',
            lineHeight: 1.65,
            color: 'rgba(35,52,47,0.82)',
          }}
        >
          {item.text}
        </p>
      </div>
    ))}
  </div>
</section>

<section
  style={{
    borderRadius: '22px',
    padding: '28px',
    background:
      'linear-gradient(135deg, rgba(18,31,47,0.9) 0%, rgba(34,53,74,0.92) 55%, rgba(74,58,38,0.84) 100%)',
    border: '1px solid rgba(201,161,90,0.22)',
    boxShadow: '0 18px 40px rgba(0,0,0,0.16)',
  }}
>
  <div
    style={{
      display: 'grid',
      gap: '16px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      alignItems: 'center',
    }}
  >
    <div>
      <h2
        style={{
          margin: 0,
          color: '#f8f5ee',
          fontSize: '1.6rem',
        }}
      >
        Ready to plan your next build?
      </h2>

      <p
        style={{
          margin: '10px 0 0 0',
          lineHeight: 1.7,
          color: 'rgba(248,245,238,0.84)',
          maxWidth: '60ch',
        }}
      >
        Open the planner, choose a character, and start from your current setup
        instead of guessing from scratch.
      </p>
    </div>

    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        justifyContent: 'flex-start',
      }}
    >
      <Link
        to="/planner"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '44px',
          padding: '0 18px',
          borderRadius: '999px',
          textDecoration: 'none',
          fontWeight: 700,
          color: '#18211d',
          background:
            'linear-gradient(180deg, var(--wwm-gold-soft) 0%, var(--wwm-gold) 100%)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
        }}
      >
        Enter the Planner
      </Link>

      <Link
        to="/privacy"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '44px',
          padding: '0 18px',
          borderRadius: '999px',
          textDecoration: 'none',
          fontWeight: 700,
          color: '#f8f5ee',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        Privacy Policy
      </Link>
    </div>
  </div>
</section>
    </div>
  )
}