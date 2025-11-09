<template>
  <div class="w-full">
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 w-full">
      <div class="w-full px-3 sm:px-4 lg:px-6">
        <div class="flex justify-between items-center h-14 sm:h-16 w-full">
          <!-- Mobile menu button -->
          <div class="flex items-center">
            <UDrawer v-model:open="isDrawer" direction="left" :dismissible="false" :handle="false"
              :ui="{ container: 'gap-0', header: 'flex justify-end', content: 'w-full' }">
              <UButton v-if="showSidebar" class="md:hidden mr-1" variant="ghost" color="gray" icon="i-heroicons-bars-3"
                :ui="{ rounded: 'rounded-full' }" @click="isDrawer = true" />
              <template #header>
                <UButton color="primary" variant="ghost" class="self-end" icon="i-lucide-x" @click="isDrawer = false" />
              </template>
              <template #body>
                <nav class="flex-1 overflow-y-auto">
                  <NuxtLink v-for="item in sidebarItems" :key="item.to + '-mobile'" :to="item.to" class="group flex items-center px-4 py-3 mx-2 rounded-lg text-base font-medium text-gray-700 transition-colors
                    hover:[color:var(--ui-primary)]
                    hover:[background:color-mix(in_oklch,white 92%,var(--ui-primary))]" :class="[{
                      'text-primary [background:color-mix(in_oklch,white 90%,var(--ui-primary))]': route.path === item.to
                    }]" @click="isDrawer = false">
                    <UIcon :name="item.icon" class="w-6 h-6 mr-3 flex-shrink-0" />
                    <span>{{ item.label }}</span>
                  </NuxtLink>
                </nav>
              </template>
              <template #footer>
                <div v-if="isLoggedIn" class="p-4 border-t border-gray-100 mt-auto">
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-user-circle" class="w-10 h-10 text-gray-400 flex-shrink-0" />
                    <div class="ml-3 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ userStore.displayName }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ userStore.user?.email }}</p>
                    </div>
                  </div>
                </div>
              </template>

            </UDrawer>
            <div class="flex items-center">
              <Logo class="mr-2" />
              <NuxtLink to="/" class="text-xl font-extrabold text-primary-600 font-inter">LeaseDirector</NuxtLink>
            </div>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex space-x-1 sm:space-x-2 lg:space-x-4">
            <NuxtLink v-for="item in topNavItems" :key="item.to" :to="item.to"
              class="text-gray-700 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors" :class="[
                'hover:opacity-90',
                'hover:[color:var(--ui-primary)]',
                'hover:[background:color-mix(in_oklch,white 90%,var(--ui-primary))]',
                'text-sm sm:text-base'
              ]" :active-class="'text-primary [background:color-mix(in_oklch,white 92%,var(--ui-primary))]'">
              <span class="inline-flex items-center gap-1 sm:gap-2">
                <UIcon :name="item.icon" class="w-4 h-4 sm:w-5 sm:h-5" />
                <span class="hidden sm:inline">{{ item.label }}</span>
              </span>
            </NuxtLink>
          </nav>

          <ClientOnly>
            <template #fallback>
              <div class="h-8 w-24 bg-gray-200 rounded" />
            </template>

            <div class="flex items-center gap-1 sm:gap-3">
              <template v-if="!isLoggedIn">
                <NuxtLink to="/auth/login"
                  class="text-gray-700 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors hover:[color:var(--ui-primary)] whitespace-nowrap">
                  <span class="hidden sm:inline">Sign In</span>
                  <UIcon name="i-heroicons-arrow-right-on-rectangle" class="sm:hidden w-5 h-5" />
                </NuxtLink>

                <NuxtLink to="/auth/signup"
                  class="text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                  style="background: var(--ui-primary)">
                  <span class="hidden sm:inline">Get Started</span>
                  <span class="sm:hidden">Sign Up</span>
                </NuxtLink>
              </template>

              <template v-else>
                <div class="relative">
                  <UButton variant="ghost" color="gray" icon="i-heroicons-bell" aria-label="Notifications"
                    class="notifications-button p-1.5 sm:p-2" @click.stop="notificationOpen = !notificationOpen" />
                  <div v-if="hasUnreadNotifications"
                    class="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                  <div v-if="notificationOpen" class="fixed inset-0 bg-transparent bg-opacity-50 z-40 md:hidden"
                    @click="notificationOpen = false" />
                  <div v-if="notificationOpen"
                    class="notifications-dropdown fixed inset-x-4 top-16 sm:top-20 sm:right-0 sm:left-auto sm:max-w-sm bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200 max-h-[calc(100vh-6rem)] flex flex-col">
                    <div class="px-4 py-2 border-b border-gray-100">
                      <div class="flex justify-between items-center">
                        <h3 class="font-medium">Notifications</h3>
                        <UButton variant="ghost" color="gray" size="sm" icon="i-heroicons-x-mark"
                          @click="notificationOpen = false" aria-label="Close notifications" />
                      </div>
                    </div>

                    <div class="flex-1 overflow-y-auto">
                      <div v-if="notifications.length === 0" class="px-4 py-8 text-center text-gray-500">
                        No new notifications
                      </div>
                      <div v-else>
                        <div v-for="n in notifications" :key="n.id"
                          class="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                          <div class="flex items-start">
                            <UIcon :name="n.icon" class="h-5 w-5 text-gray-400" />
                            <div class="ml-3 flex-1">
                              <p class="text-sm font-medium text-gray-900">{{ n.title }}</p>
                              <p class="text-sm text-gray-500">{{ n.message }}</p>
                              <p class="text-xs text-gray-400 mt-1">{{ n.time }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-if="notifications.length > 0"
                      class="px-4 py-2 border-t border-gray-100 text-center sticky bottom-0 bg-white">
                      <UButton variant="ghost" size="sm" color="primary" label="Mark all as read"
                        class="w-full justify-center" @click="markAllAsRead" />
                    </div>
                  </div>
                </div>

                <div class="relative user-menu-dropdown">
                  <UButton variant="ghost" class="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2"
                    @click.stop="userMenuOpen = !userMenuOpen">
                    <UIcon name="i-heroicons-user-circle" class="h-5 w-5 sm:h-6 sm:w-6" />
                    <span class="hidden sm:inline text-sm sm:text-base">{{ userStore.displayName }}</span>
                    <UIcon name="i-heroicons-chevron-down" class="hidden sm:block h-4 w-4" />
                  </UButton>

                  <div v-if="userMenuOpen" class="fixed inset-0 bg-transparent bg-opacity-50 z-40 md:hidden"
                    @click="userMenuOpen = false"></div>
                  <div v-if="userMenuOpen"
                    class="fixed min-w-[9rem] inset-x-4 top-16 sm:top-20 sm:right-0 sm:left-auto bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200 max-h-[calc(100vh-6rem)] flex flex-col w-auto sm:max-w-sm">
                    <div class="px-4 py-2 border-b border-gray-100 space-y-1">
                      <div class="flex justify-between items-center">
                        <h3 class="font-medium">Account</h3>
                        <UButton variant="ghost" color="gray" size="sm" icon="i-heroicons-x-mark"
                          @click="userMenuOpen = false" aria-label="Close menu" />
                      </div>
                    </div>
                    <div class="flex-1 overflow-y-auto">
                      <NuxtLink to="/app/profile"
                        class="flex items-center px-2 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors text-base md:text-sm"
                        @click="userMenuOpen = false" active-class="text-primary">
                        <UIcon name="i-heroicons-user" class="w-5 h-5 mr-3" />
                        <span>Profile</span>
                      </NuxtLink>
                      <NuxtLink to="/app/portfolios"
                        class="flex items-center px-2 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors text-base md:text-sm"
                        @click="userMenuOpen = false" active-class="text-primary">
                        <UIcon name="i-heroicons-briefcase" class="w-5 h-5 mr-3" />
                        <span>Portfolio</span>
                      </NuxtLink>
                      <NuxtLink to="/app/settings"
                        class="flex items-center px-2 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors text-base md:text-sm"
                        @click="userMenuOpen = false" active-class="text-primary">
                        <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 mr-3" />
                        <span>Settings</span>
                      </NuxtLink>

                      <button @click="handleLogout"
                        class="w-full text-left px-2 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors text-base md:text-sm flex items-center">
                        <UIcon name="i-heroicons-arrow-left-on-rectangle" class="w-5 h-5 mr-3" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>

              </template>

            </div>
          </ClientOnly>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/stores/user'
import { useAuth } from '~/composables/useAuth'
import { getSidebarNav, getTopHeaderNav } from '~/utils/navigation'

const props = withDefaults(defineProps<{
  showSidebar?: boolean,
  sidebarItems?: Array<{ to: string; label: string; icon: string }>,
  sidebarOpen?: boolean
}>(), {
  showSidebar: false,
  sidebarOpen: false
})
// Watch for route changes to close the sidebar
const route = useRoute()
const isDrawer = ref<boolean>(false)

/** Auth + user */
const userStore = useUserStore()
const { userRole, isLoggedIn } = storeToRefs(userStore)
const { signout } = useAuth()
const router = useRouter()

// Get sidebar items based on user role
const sidebarItems = computed(() => props.sidebarItems || getSidebarNav(userRole.value || 'tenant'))

/** Top nav data */
const topNavItems = getTopHeaderNav()

/** Notifications */
const notificationOpen = ref(false)
const notifications = ref([
  { id: 1, title: 'New message', message: 'You have a new message from John Doe', time: '2m ago', icon: 'i-heroicons-envelope', read: false },
  { id: 2, title: 'Payment received', message: 'Rent payment received for Unit #42', time: '1h ago', icon: 'i-heroicons-currency-dollar', read: true },
  { id: 3, title: 'Maintenance update', message: 'Your maintenance request #1234 has been completed', time: '5h ago', icon: 'i-heroicons-wrench-screwdriver', read: true }
])
const hasUnreadNotifications = computed(() => notifications.value.some(n => !n.read))
function markAllAsRead() { notifications.value = notifications.value.map(n => ({ ...n, read: true })) }

/** User menu */
const userMenuOpen = ref(false)

/** Click outside closing */
// Close menus when clicking outside
const closeOnClickOutside = (ev: MouseEvent) => {
  const target = ev.target as HTMLElement

  // Don't close if clicking on a button that toggles a menu
  if (target.closest('.notifications-button, .user-menu-dropdown > button')) {
    return
  }

  // Close notifications dropdown if click is outside
  const notificationsDropdown = document.querySelector('.notifications-dropdown')
  if (notificationOpen.value && notificationsDropdown && !notificationsDropdown.contains(target)) {
    notificationOpen.value = false
  }

  // Close user menu if click is outside
  const userMenu = document.querySelector('.user-menu-dropdown')
  if (userMenuOpen.value && userMenu && !userMenu.contains(target)) {
    userMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeOnClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeOnClickOutside)
})

/** Logout */
async function handleLogout() {
  try {
    await signout()
    await navigateTo('/')
    window.location.reload() // Ensure a full page reload to clear all state
  } catch (e) {
    // Clear user data and redirect even if there was an error
    userStore.clearUser()
    userStore.clearStorage()
    await navigateTo('/')
    window.location.reload()
  }
}
</script>
