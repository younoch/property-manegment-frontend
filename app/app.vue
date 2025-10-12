<template>
  <UApp 
    :ui="{ 
      notifications: { toaster: false },
      container: {
        constrained: 'max-w-screen-2xl',
        padding: 'px-4 sm:px-6 lg:px-8',
      }
    }"
    class="min-h-screen w-screen overflow-x-hidden"
  >
    <template #notifications>
      <ClientOnly>
        <UToaster />
      </ClientOnly>
    </template>

    <div class="min-h-screen w-full flex flex-col">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import type { MetaObject } from '@nuxt/schema'
import { useThemeColor } from '~/composables/useThemeColor'

// Initialize theme
const { initFromStorage, current } = useThemeColor()

// Watch for theme changes to update meta theme-color
watch(current, (newTheme) => {
  if (process.client) {
    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--color-background').trim() || '#ffffff'
    useSeoMeta({
      themeColor
    })
  }
}, { immediate: true })

// This ensures the page is scrolled to top on route change
const route = useRoute()

// Initialize theme on client-side
onMounted(() => {
  if (process.client) {
    initFromStorage()
  }
})

// Set up meta tags for SEO and mobile optimization
useSeoMeta({
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
  appleMobileWebAppCapable: 'yes',
  appleMobileWebAppStatusBarStyle: 'black-translucent',
  appleMobileWebAppTitle: 'LeaseDirector'
} as const)


watch(() => route.path, () => {
  window.scrollTo(0, 0)
})
</script>
