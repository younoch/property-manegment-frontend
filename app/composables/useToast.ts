// Local shim for useToast to ensure availability across environments
// This re-exports/bridges to Nuxt UI's toast if present, and provides a safe no-op fallback otherwise.

import { useNuxtApp } from 'nuxt/app'

export type ToastAddOptions = {
  title?: string
  description?: string
  icon?: string
  color?: string
  timeout?: number
  actions?: Array<{ label: string; onClick?: () => void; icon?: string; color?: string }>
}

// Provide a local composable that bridges to the UI toast system if present
export function useToast() {
  const nuxtApp = useNuxtApp() as any
  const toast = nuxtApp?.$ui?.toast || nuxtApp?.$toast

  function add(options: ToastAddOptions) {
    if (toast && typeof toast.add === 'function') {
      return toast.add(options)
    }
    if (process.client) {
      // eslint-disable-next-line no-console
      console.warn('[useToast] UI toast system is unavailable. Showing console fallback:', options?.title || options)
    }
    return undefined
  }

  return { add }
}
