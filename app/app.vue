<template>
  <UApp :ui="{ notifications: { toaster: false } }">
       <template #notifications>
      <ClientOnly>
        <UToaster />
      </ClientOnly>
    </template>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
