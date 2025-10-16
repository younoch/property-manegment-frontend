<template>
  <div class="bg-gray-50">
    <ClientOnly>
      <FeedbackButton v-if="!route.path.includes('onboarding')" />
    </ClientOnly>

    <AppHeader
      :show-sidebar="true"
      :sidebar-items="sidebarItems"
      v-model:sidebar-open="sidebarOpen"
    />

    <div class="flex">
      <ClientOnly>
        <aside
          class="hidden md:block w-72 flex-shrink-0 border-r border-gray-200 bg-white"
        >
          <nav class="p-2 space-y-1">
            <NuxtLink
              v-for="item in sidebarItems"
              :key="item.to"
              :to="item.to"
              class="group flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 transition-colors
                     hover:[color:var(--ui-primary)]
                     hover:[background:color-mix(in_oklch,white 92%,var(--ui-primary))]"
              active-class="text-primary [background:color-mix(in_oklch,white 90%,var(--ui-primary))]"
            >
              <UIcon :name="item.icon" class="w-5 h-5 mr-3" />
              <span class="whitespace-nowrap">{{ item.label }}</span>
            </NuxtLink>
          </nav>
        </aside>
      </ClientOnly>

      <main class="flex-1 min-w-0">
        <div class="w-full">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import FeedbackButton from '~/components/feedback/FeedbackButton.vue'
import AppHeader from '~/components/layout/AppHeader.vue'
import { useUserStore } from '~/stores/user'

const route = useRoute()
const sidebarOpen = ref(false)

const userStore = useUserStore()
const { userRole } = storeToRefs(userStore)

onMounted(async () => {
  if (process.client) {
    await userStore.fetchUser()
    if (userRole.value !== 'super_admin') {
      navigateTo('/app/dashboard')
    }
  }
})

watch(userRole, (role) => {
  if (process.client && role && role !== 'super_admin') {
    navigateTo('/app/dashboard')
  }
})

const sidebarItems = computed(() => [
  { to: '/super-admin/monitoring', label: 'Overview', icon: 'i-heroicons-chart-bar' },
  { to: '/super-admin/monitoring/health', label: 'System Health', icon: 'i-heroicons-heart' },
  { to: '/super-admin/monitoring/services', label: 'Services', icon: 'i-heroicons-cog-6-tooth' },
  { to: '/super-admin/monitoring/metrics', label: 'Metrics', icon: 'i-heroicons-chart-pie' },
  { to: '/super-admin/monitoring/logs', label: 'Logs', icon: 'i-heroicons-list-bullet' },
  { to: '/super-admin/monitoring/feedback', label: 'Feedback', icon: 'i-heroicons-chat-bubble-left-right' },
  { to: '/super-admin/monitoring/users', label: 'Users', icon: 'i-heroicons-users' },
  { to: '/super-admin/monitoring/settings', label: 'Settings', icon: 'i-heroicons-adjustments-horizontal' }
])
</script>
