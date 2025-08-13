<template>
  <UApp :ui="{ notifications: { toaster: false } }">
   <template #notifications>
      <ClientOnly>
        <UNotifications />
      </ClientOnly>
    </template>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
