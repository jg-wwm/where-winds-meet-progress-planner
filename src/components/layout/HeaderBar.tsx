import { useResponsive } from '../../hooks/useResponsive'

interface HeaderBarProps {
  updatedAt: string
  saveState: 'idle' | 'saving' | 'saved' | 'error'
  onExportJson: () => void
  onImportJson: () => void
}

export const HeaderBar = ({
  updatedAt,
  saveState,
  onExportJson,
  onImportJson,
}: HeaderBarProps) => {
  const { isPhone } = useResponsive()

  const saveLabel =
    saveState === 'saving'
      ? 'Saving...'
      : saveState === 'error'
        ? 'Save failed'
        : 'Local save enabled'

  const saveToneClass =
    saveState === 'error'
      ? 'text-rose-300'
      : saveState === 'saving'
        ? 'text-[var(--wwm-gold-soft)]'
        : 'text-[var(--wwm-text-muted)]'

  const updatedLabel = updatedAt ? new Date(updatedAt).toLocaleString() : '—'

  return (
    <header
      className="sticky top-0 z-20 border-b border-[var(--wwm-border)] bg-[rgba(6,16,25,0.88)] backdrop-blur-xl"
      style={{
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.18)',
      }}
    >
      <div
        className={`mx-auto max-w-[1600px] gap-4 md:px-6 ${
          isPhone
            ? 'grid px-4 py-4'
            : 'flex flex-wrap items-stretch justify-between px-4 py-4'
        }`}
      >
        <div className="min-w-0">
          <div className="wwm-header-flourish flex items-center gap-3">
            <div
              className="hidden h-12 w-[3px] rounded-full md:block"
              style={{
                background:
                  'linear-gradient(180deg, var(--wwm-gold-soft) 0%, var(--wwm-jade-soft) 100%)',
                boxShadow: '0 0 14px rgba(240,220,168,0.12)',
              }}
            />

            <div className="min-w-0">
              <h1
                className={`wwm-display-title wwm-display-glow ${
                  isPhone ? 'text-[29px]' : 'text-[52px]'
                }`}
              >
                <span className="wwm-title-gradient">Where Winds Meet</span>{' '}
                <span className="wwm-title-subtle">Progress Planner</span>
              </h1>

              <p
                className={`wwm-subtitle-kicker mt-1 ${
                  isPhone ? 'text-[11px]' : 'text-sm'
                } text-[var(--wwm-text-muted)]`}
              >
                Mystic Skill planning, timers, checklists, and progression tracking
              </p>
            </div>
          </div>
        </div>

        <div
          className={`grid gap-3 ${
            isPhone ? 'w-full' : 'ml-auto w-auto'
          }`}
        >
          <div
            className={`gap-2 ${
              isPhone ? 'grid grid-cols-1' : 'flex flex-wrap justify-end'
            }`}
          >
            <button
              type="button"
              onClick={onImportJson}
              className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isPhone ? 'w-full' : ''
              }`}
              style={{
                borderColor: 'rgba(216, 181, 106, 0.35)',
                background:
                  'linear-gradient(180deg, rgba(55, 40, 18, 0.92) 0%, rgba(34, 24, 10, 0.96) 100%)',
                color: 'var(--wwm-gold-soft)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              Import JSON
            </button>

            <button
              type="button"
              onClick={onExportJson}
              className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isPhone ? 'w-full' : ''
              }`}
              style={{
                borderColor: 'rgba(127, 214, 179, 0.35)',
                background:
                  'linear-gradient(180deg, rgba(23, 65, 53, 0.94) 0%, rgba(16, 48, 40, 0.98) 100%)',
                color: 'var(--wwm-jade-soft)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              Export JSON
            </button>
          </div>

          <div
            className={`text-xs ${
              isPhone ? 'text-left' : 'text-right'
            } text-[var(--wwm-text-muted)]`}
          >
            <div className={saveToneClass}>{saveLabel}</div>
            <div className="mt-1">Updated: {updatedLabel}</div>
          </div>
        </div>
      </div>
    </header>
  )
}