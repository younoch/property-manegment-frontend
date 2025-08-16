<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6">
    <h1 class="text-2xl font-semibold mb-4">Settings</h1>
    <UCard>
      <div class="space-y-6">
        <div>
          <h2 class="text-sm font-semibold text-gray-700 mb-2">Notifications</h2>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Email notifications</span>
            <UToggle v-model="settings.emailNotifications" />
          </div>
        </div>
        <div>
          <h2 class="text-sm font-semibold text-gray-700 mb-2">Appearance</h2>
          <USelect v-model="settings.theme" :items="themes" class="w-48" />
        </div>
        <div>
          <UButton @click="save" :loading="saving">Save changes</UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const settings = ref({
  emailNotifications: true,
  theme: 'system'
})

const themes = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
]

const saving = ref(false)
const save = async () => {
  saving.value = true
  await new Promise(r => setTimeout(r, 700))
  saving.value = false
}
</script>



