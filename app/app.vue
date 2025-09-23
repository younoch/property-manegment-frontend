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
// This ensures the page is scrolled to top on route change
const route = useRoute()

watch(() => route.path, () => {
  window.scrollTo(0, 0)
})
</script>

<style>
/* Ensure html and body take full viewport width without scrolling */
html, body {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

/* Ensure all direct children of body take full width */
body > * {
  width: 100%;
  max-width: 100%;
}

/* Ensure UApp and its containers don't cause overflow */
html, body, #__nuxt, #__layout, #__nuxt > div {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}
</style>
