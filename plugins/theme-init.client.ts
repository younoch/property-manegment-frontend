// plugins/theme-init.client.ts
import { useThemeColor } from '~/composables/useThemeColor'

export default defineNuxtPlugin(() => {
  // This will run on client-side only, before the app is mounted
  const { initFromStorage } = useThemeColor()
  
  // Initialize theme immediately when the plugin loads
  if (process.client) {
    // Use nextTick to ensure the DOM is ready
    setTimeout(() => {
      initFromStorage()
    }, 0)
  }
})
