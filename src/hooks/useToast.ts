import { useToastContext } from '../components/feedback/ToastProvider'

export const useToast = () => {
  const { showToast, dismissToast, clearToasts, toasts } = useToastContext()

  return {
    toast: showToast,
    dismissToast,
    clearToasts,
    toasts,
  }
}