import { useResponsive } from '../../hooks/useResponsive'
import { useToastContext, type ToastItem } from './ToastProvider'

const toneStyles: Record<
  ToastItem['tone'],
  {
    borderColor: string
    background: string
    accent: string
  }
> = {
  success: {
    borderColor: 'rgba(127, 214, 179, 0.38)',
    background:
      'linear-gradient(180deg, rgba(19, 48, 44, 0.96) 0%, rgba(13, 28, 32, 0.98) 100%)',
    accent: 'var(--wwm-jade-soft)',
  },
  error: {
    borderColor: 'rgba(185, 111, 111, 0.42)',
    background:
      'linear-gradient(180deg, rgba(58, 25, 31, 0.96) 0%, rgba(24, 14, 18, 0.98) 100%)',
    accent: '#f1b7b7',
  },
  info: {
    borderColor: 'rgba(119, 191, 178, 0.34)',
    background:
      'linear-gradient(180deg, rgba(21, 39, 56, 0.96) 0%, rgba(12, 22, 32, 0.98) 100%)',
    accent: '#b8e6dc',
  },
  warning: {
    borderColor: 'rgba(201, 161, 90, 0.4)',
    background:
      'linear-gradient(180deg, rgba(64, 45, 22, 0.96) 0%, rgba(28, 20, 12, 0.98) 100%)',
    accent: 'var(--wwm-gold-soft)',
  },
}

export const ToastViewport = () => {
  const { isPhone } = useResponsive()
  const { toasts, dismissToast } = useToastContext()

  if (toasts.length === 0) {
    return null
  }

  return (
    <div
      className={`pointer-events-none fixed z-[100] flex max-w-[100vw] flex-col gap-3 px-3 ${
        isPhone
          ? 'inset-x-0 bottom-4 items-center'
          : 'right-4 top-4 w-full max-w-[380px] items-stretch'
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const tone = toneStyles[toast.tone]

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto overflow-hidden rounded-2xl border shadow-[var(--wwm-shadow-lg)] backdrop-blur-xl ${
              isPhone ? 'w-full max-w-[520px]' : 'w-full'
            }`}
            style={{
              borderColor: tone.borderColor,
              background: tone.background,
            }}
            role="status"
          >
            <div className="flex items-start gap-3 p-3.5">
              <div
                className="mt-0.5 h-8 w-1.5 flex-shrink-0 rounded-full"
                style={{
                  background: `linear-gradient(180deg, ${tone.accent} 0%, rgba(255,255,255,0.22) 100%)`,
                }}
              />

              <div className="min-w-0 flex-1">
                <div
                  className="text-sm font-semibold"
                  style={{ color: 'var(--wwm-text)' }}
                >
                  {toast.title}
                </div>

                {toast.message ? (
                  <div className="mt-1 text-xs leading-5 text-[var(--wwm-text-muted)]">
                    {toast.message}
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="rounded-full border px-2 py-1 text-xs font-semibold transition-all duration-200"
                style={{
                  borderColor: 'var(--wwm-border)',
                  background: 'rgba(15, 23, 42, 0.45)',
                  color: 'var(--wwm-text-muted)',
                }}
                aria-label="Dismiss notification"
              >
                Close
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}