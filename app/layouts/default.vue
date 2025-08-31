<template>
  <div class="min-h-screen bg-gray-50">
    <!-- New header component -->
    <AppHeader :show-sidebar="showSidebar" @openSidebar="sidebarOpen = true" />

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:flex">
      <ClientOnly>
        <aside
          v-if="showSidebar"
          class="hidden md:block md:w-64 md:flex-none border-r border-gray-200 bg-white"
        >
          <nav class="p-4 space-y-1">
            <NuxtLink
              v-for="item in sidebarItems"
              :key="item.to"
              :to="item.to"
              class="group flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 transition-colors
                     hover:[color:var(--ui-primary)]
                     hover:[background:color-mix(in_oklch,white 92%,var(--ui-primary))]"
              active-class="[color:var(--ui-primary)] [background:color-mix(in_oklch,white 90%,var(--ui-primary))]"
            >
              <UIcon :name="item.icon" class="w-5 h-5 mr-3" />
              <span>{{ item.label }}</span>
            </NuxtLink>
          </nav>
        </aside>
      </ClientOnly>

      <main class="flex-1">
        <slot />
      </main>
    </div>

    <!-- Mobile Sidebar Drawer -->
    <ClientOnly>
      <div class="md:hidden">
        <USlideover v-model="sidebarOpen" side="right">
          <div class="w-64 h-full border-l border-gray-200 bg-white">
            <div class="flex items-center justify-between h-16 px-4 border-b">
              <span class="text-base font-semibold">Menu</span>
              <UButton icon="i-heroicons-x-mark" variant="ghost" @click="sidebarOpen = false" />
            </div>
            <nav class="p-4 space-y-1">
              <NuxtLink
                v-for="item in sidebarItems"
                :key="item.to + '-mobile'"
                :to="item.to"
                class="group flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 transition-colors
                       hover:[color:var(--ui-primary)]
                       hover:[background:color-mix(in_oklch,white 92%,var(--ui-primary))]"
                active-class="[color:var(--ui-primary)] [background:color-mix(in_oklch,white 90%,var(--ui-primary))]"
                @click="sidebarOpen = false"
              >
                <UIcon :name="item.icon" class="w-5 h-5 mr-3" />
                <span>{{ item.label }}</span>
              </NuxtLink>
            </nav>
          </div>
        </USlideover>
      </div>
    </ClientOnly>

    <!-- Footer (unchanged) -->
    <footer class="bg-gray-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- ... your footer content ... -->
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'nuxt/app'
import { storeToRefs } from 'pinia'
import AppHeader from '~/components/layout/AppHeader.vue'
import { useUserStore } from '~/stores/user'
import { getSidebarNav, type UserRole } from '~/utils/navigation'

const userStore = useUserStore()
const { userRole } = storeToRefs(userStore)

const sidebarOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { sidebarOpen.value = false })

const sidebarItems = computed(() => getSidebarNav((userRole.value || 'tenant') as UserRole))
const showSidebar = computed(() => {
  const role = userRole.value
  return role === 'super_admin' || role === 'landlord' || role === 'manager'
})
</script>
