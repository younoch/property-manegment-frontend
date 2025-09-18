// plugins/theme.client.ts
import { useThemeColor } from '~/composables/useThemeColor'

export default defineNuxtPlugin(() => {
  const { initFromStorage } = useThemeColor()
  initFromStorage()
})
