import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from 'react'

export type ToastTone = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  title: string
  message?: string
  tone: ToastTone
  durationMs: number
}

interface ShowToastInput {
  title: string
  message?: string
  tone?: ToastTone
  durationMs?: number
}

interface ToastContextValue {
  toasts: ToastItem[]
  showToast: (input: ShowToastInput) => void
  dismissToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const createToastId = () =>
  `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timeoutMapRef = useRef<Map<string, number>>(new Map())

  const dismissToast = useCallback((id: string) => {
    const timeoutId = timeoutMapRef.current.get(id)

    if (timeoutId) {
      window.clearTimeout(timeoutId)
      timeoutMapRef.current.delete(id)
    }

    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    timeoutMapRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId)
    })
    timeoutMapRef.current.clear()
    setToasts([])
  }, [])

  const showToast = useCallback(
    ({
      title,
      message,
      tone = 'info',
      durationMs = 3200,
    }: ShowToastInput) => {
      const id = createToastId()

      const nextToast: ToastItem = {
        id,
        title,
        message,
        tone,
        durationMs,
      }

      setToasts((current) => [...current, nextToast].slice(-4))

      const timeoutId = window.setTimeout(() => {
        dismissToast(id)
      }, durationMs)

      timeoutMapRef.current.set(id, timeoutId)
    },
    [dismissToast],
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      toasts,
      showToast,
      dismissToast,
      clearToasts,
    }),
    [toasts, showToast, dismissToast, clearToasts],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export const useToastContext = () => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider.')
  }

  return context
}

export const ToastText = ({
  title,
  message,
}: {
  title: string
  message?: ReactNode
}) => (
  <div className="min-w-0">
    <div className="text-sm font-semibold text-[var(--wwm-text)]">{title}</div>
    {message ? (
      <div className="mt-1 text-xs leading-5 text-[var(--wwm-text-muted)]">
        {message}
      </div>
    ) : null}
  </div>
)