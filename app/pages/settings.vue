<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6">
    <h1 class="text-xl md:text-2xl font-semibold mb-6">Settings</h1>
    <UCard>
      <div class="space-y-8">
        <!-- Notifications Section -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Email notifications</h3>
                <p class="text-sm text-gray-500">Receive email notifications for important updates</p>
              </div>
              <USwitch v-model="settings.emailNotifications" />
            </div>
          </div>
        </div>

        <!-- Theme Color Section -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Theme Color</h2>
          <div class="space-y-4">
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-between">
                <p class="text-sm text-gray-500">Theme color</p>
                <div class="flex gap-1.5 overflow-x-auto py-2 px-1 -mx-1">
                  <button
                    v-for="c in (keys as ThemeKey[])"
                    :key="c"
                    class="h-6 w-6 rounded-full border-2 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform hover:scale-110 shrink-0"
                    :class="[
                      options[c]?.bgClass || '',
                      c === current 
                        ? 'ring-2 ring-offset-1 ring-primary-500 scale-110' 
                        : 'border-gray-200'
                    ]"
                    :aria-label="`Set ${labelMap[c] || c}`"
                    @click="pickTheme(c)"
                  />
                </div>
              </div>
              <p class="mt-3 text-sm text-gray-500">
                Current: <span class="font-medium text-gray-900">{{ labelMap[current as keyof typeof labelMap] || current }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="pt-2">
          <UButton 
            @click="save" 
            :loading="saving"
            color="primary"
            class="w-full sm:w-auto"
          >
            Save Changes
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useThemeColor, type ThemeKey } from '~/composables/useThemeColor'
import { useToast } from '#imports'

definePageMeta({ middleware: 'auth' })

const settings = ref({
  emailNotifications: true,
  theme: 'system'
})

// Theme color functionality
const { current, setTheme, keys, options } = useThemeColor()
const labelMap: Record<ThemeKey, string> = {
  black: 'Black', red: 'Red', orange: 'Orange', amber: 'Amber', yellow: 'Yellow', lime: 'Lime',
  green: 'Green', emerald: 'Emerald', teal: 'Teal', cyan: 'Cyan', sky: 'Sky', blue: 'Blue',
  indigo: 'Indigo', violet: 'Violet', purple: 'Purple', fuchsia: 'Fuchsia', pink: 'Pink', rose: 'Rose'
}

const toast = useToast()

const pickTheme = (color: ThemeKey) => {
  setTheme(color)
  // You might want to save this preference to your backend here
}

const saving = ref(false)
const save = async () => {
  saving.value = true
  try {
    // Save settings to your backend
    await new Promise(r => setTimeout(r, 700))
    // Show success message
    toast.add({
      title: 'Settings saved',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    toast.add({
      title: 'Error saving settings',
      description: errorMessage,
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  } finally {
    saving.value = false
  }
}
</script>



