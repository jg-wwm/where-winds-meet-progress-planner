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
      className="mt-10 border-t border-[var(--wwm-border)] bg-[rgba(6,16,25,0.82)]"
      style={{
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      <div className="mx-auto grid max-w-[1600px] gap-4 px-4 py-6 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="wwm-display-title-soft text-[24px] text-[var(--wwm-text)]">
              Where Winds Meet Progress Planner
            </div>
            <div className="mt-1 text-sm leading-6 text-[var(--wwm-text-muted)]">
              Unofficial fan-made progression planner for the Where Winds Meet
              community.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {showBackToPlanner ? (
              <button
                type="button"
                onClick={onOpenPlanner}
                className="wwm-footer-link"
              >
                Back to Planner
              </button>
            ) : null}

            <button
              type="button"
              onClick={onOpenPrivacy}
              className="wwm-footer-link"
            >
              Privacy Policy
            </button>
          </div>
        </div>

        <div className="grid gap-1 text-xs leading-6 text-[var(--wwm-text-dim)]">
          <div>
            Originally created for the OopsHeroes guild and now shared with the wider
            Where Winds Meet community.
          </div>
          <div>
            Built for players who want cleaner planning, progress tracking, and
            companion tools.
          </div>
          <div>
            Unofficial fan-made project. Not affiliated with or endorsed by the
            developers, publishers, or rights holders of Where Winds Meet.
          </div>
        </div>
      </div>
    </footer>
  )
}