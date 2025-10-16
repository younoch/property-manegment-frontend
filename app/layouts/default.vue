<template>
  <div class="bg-gray-50">
    <ClientOnly>
      <FeedbackButton v-if="!route.path.includes('onboarding')" />
    </ClientOnly>
    
    <AppHeader 
      :show-sidebar="showSidebar" 
      :sidebar-items="sidebarItems"
      v-model:sidebar-open="sidebarOpen"
    />

    <div class="flex">
      <ClientOnly>
        <aside
          v-if="showSidebar"
          class="hidden md:block w-64 flex-shrink-0 border-r border-gray-200 bg-white"
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
          <OnboardingWizard 
            v-if="showOnboardingWizard"
            :open="showOnboardingWizard"
            @update:open="showOnboardingWizard = $event"
            @completed="handleOnboardingComplete"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import FeedbackButton from '~/components/feedback/FeedbackButton.vue'
import AppHeader from '~/components/layout/AppHeader.vue'
import OnboardingWizard from '~/components/ui/OnboardingWizard.vue'
import { useUserStore } from '~/stores/user'
import { useAuthStore } from '~/stores/auth'
import { getSidebarNav } from '#imports'

const route = useRoute()
const sidebarOpen = ref(false)

// Theme is now initialized in the theme-init.client.ts plugin

const userStore = useUserStore()
const authStore = useAuthStore()
const { userRole } = storeToRefs(userStore)

// Fetch user data when layout is mounted
onMounted(async () => {
  if (process.client) {
    await userStore.fetchUser()
  }
})

const showSidebar = computed(() => {
  const role = userRole.value
  return role === 'super_admin' || role === 'landlord' || role === 'manager'
})

const showOnboardingWizard = ref(false)

// Watch for changes to user and update onboarding wizard visibility
watch(() => userStore.user, (newUser) => {
  if (newUser) {
    showOnboardingWizard.value = !!newUser.requires_onboarding
  } else {
    showOnboardingWizard.value = false
  }
}, { immediate: true })

const handleOnboardingComplete = async () => {
  try {
    await authStore.completeOnboarding()
    navigateTo('/app/units/?onboarding=true')
  } catch (error) {
    console.error('Failed to complete onboarding:', error)
    navigateTo('/app/dashboard')
  }
}

// Sidebar state is now managed by AppHeader

const sidebarItems = computed(() => getSidebarNav(userRole.value || 'tenant'))
</script>
