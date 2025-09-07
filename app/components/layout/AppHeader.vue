<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Brand -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center"
               style="background: var(--ui-primary)">
            <span class="text-white font-bold text-lg">P</span>
          </div>
          <span class="text-xl font-bold text-gray-900">PropertyManager</span>
        </NuxtLink>

        <!-- Top Nav -->
        <nav class="hidden md:flex space-x-6">
          <NuxtLink
            v-for="item in topNavItems"
            :key="item.to"
            :to="item.to"
            class="text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="[
              'hover:opacity-90',
              // hover color via CSS var for theme friendliness
              'hover:[color:var(--ui-primary)]',
              'hover:[background:color-mix(in_oklch,white 90%,var(--ui-primary))]'
            ]"
            :active-class="'[color:var(--ui-primary)] [background:color-mix(in_oklch,white 92%,var(--ui-primary))]'"
          >
            <span class="inline-flex items-center gap-2">
              <UIcon :name="item.icon" class="w-5 h-5" />
              <span>{{ item.label }}</span>
            </span>
          </NuxtLink>
        </nav>

        <!-- Right side -->
        <ClientOnly>
          <template #fallback>
            <div class="h-8 w-24 bg-gray-200 rounded" />
          </template>

          <div class="flex items-center gap-3">
            <!-- Auth (signed out) -->
            <template v-if="!isLoggedIn">
              <NuxtLink
                to="/auth/login"
                class="text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:[color:var(--ui-primary)]"
              >
                Sign In
              </NuxtLink>

              <NuxtLink
                to="/auth/register"
                class="text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                style="background: var(--ui-primary)"
              >
                Get Started
              </NuxtLink>
            </template>

            <!-- Notifications (signed in) -->
            <template v-else>
              <div class="relative">
                <UButton
                  variant="ghost"
                  color="gray"
                  icon="i-heroicons-bell"
                  aria-label="Notifications"
                  class="notifications-button"
                  @click="notificationOpen = !notificationOpen"
                />
                <div
                  v-if="hasUnreadNotifications"
                  class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
                />
                <div
                  v-if="notificationOpen"
                  class="notifications-dropdown absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                >
                  <div class="px-4 py-2 border-b border-gray-100">
                    <div class="flex justify-between items-center">
                      <h3 class="font-medium">Notifications</h3>
                      <UButton
                        variant="ghost"
                        color="gray"
                        size="sm"
                        icon="i-heroicons-x-mark"
                        @click="notificationOpen = false"
                        aria-label="Close notifications"
                      />
                    </div>
                  </div>

                  <div class="max-h-96 overflow-y-auto">
                    <div v-if="notifications.length === 0" class="px-4 py-8 text-center text-gray-500">
                      No new notifications
                    </div>
                    <div v-else>
                      <div
                        v-for="n in notifications"
                        :key="n.id"
                        class="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                      >
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

                  <div v-if="notifications.length > 0" class="px-4 py-2 border-t border-gray-100 text-center">
                    <UButton variant="ghost" size="sm" color="primary" label="Mark all as read" @click="markAllAsRead" />
                  </div>
                </div>
              </div>

              <!-- User menu -->
              <div class="relative user-menu-dropdown">
                <UButton
                  variant="ghost"
                  class="flex items-center gap-2"
                  @click="userMenuOpen = !userMenuOpen"
                >
                  <UIcon name="i-heroicons-user-circle" class="h-6 w-6" />
                  <span>{{ userStore.displayName }}</span>
                  <UIcon name="i-heroicons-chevron-down" class="h-4 w-4" />
                </UButton>

                <div
                  v-if="userMenuOpen"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                >
                  <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="userMenuOpen = false">
                    Profile
                  </NuxtLink>
                  <NuxtLink to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="userMenuOpen = false">
                    Settings
                  </NuxtLink>
                  <div class="border-t border-gray-100" />
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </template>



            <!-- Mobile menu (optional) -->
            <UButton
              v-if="showSidebar"
              class="md:hidden"
              variant="ghost"
              icon="i-heroicons-bars-3"
              @click="$emit('openSidebar')"
            />
          </div>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'nuxt/app'
import { useUserStore } from '~/stores/user'
import { useAuth } from '~/composables/useAuth'
import { getTopHeaderNav } from '~/utils/navigation'

defineProps<{ showSidebar?: boolean }>()
defineEmits<{ (e: 'openSidebar'): void }>()

/** Auth + user */
const userStore = useUserStore()
const { isLoggedIn } = storeToRefs(userStore)
const { signout } = useAuth()
const router = useRouter()

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
onMounted(() => {
  document.addEventListener('click', (ev) => {
    const t = ev.target as Element
    const userMenu = document.querySelector('.user-menu-dropdown')
    const notif = document.querySelector('.notifications-dropdown')
    const notifBtn = document.querySelector('.notifications-button')
    if (userMenu && !userMenu.contains(t)) userMenuOpen.value = false
    if (notif && notifBtn && !notif.contains(t) && !notifBtn.contains(t)) notificationOpen.value = false
  })
})

/** Logout */
async function handleLogout() {
  try {
    console.log('Logging out...')
    await signout()
    console.log('Signout successful, redirecting to home')
    await navigateTo('/')
    window.location.reload() // Ensure a full page reload to clear all state
  } catch (e) {
    console.error('[Header] Logout error:', e)
    // Clear user data and redirect even if there was an error
    userStore.clearUser()
    userStore.clearStorage()
    await navigateTo('/')
    window.location.reload()
  }
}
</script>
