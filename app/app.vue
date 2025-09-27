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
