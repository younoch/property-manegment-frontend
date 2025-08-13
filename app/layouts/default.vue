<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Navigation -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">P</span>
              </div>
              <span class="text-xl font-bold text-gray-900">PropertyManager</span>
            </NuxtLink>
          </div>

          <!-- Navigation Links -->
          <nav class="hidden md:flex space-x-6">
            <NuxtLink
              v-for="item in topNavItems"
              :key="item.to"
              :to="item.to"
              class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-green-600 bg-green-50"
            >
              <span class="inline-flex items-center space-x-2">
                <UIcon :name="item.icon" class="w-5 h-5" />
                <span>{{ item.label }}</span>
              </span>
            </NuxtLink>
          </nav>
          

          <!-- Auth Buttons -->
          <ClientOnly>
            <template #fallback>
              <div class="flex items-center space-x-4">
                <div class="h-8 w-24 bg-gray-200 rounded" />
              </div>
            </template>
            <div class="flex items-center space-x-4">
              <!-- Show when user is NOT authenticated -->
              <template v-if="!isLoggedIn">
                <NuxtLink 
                  to="/auth/login" 
                  class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </NuxtLink>
                
                <NuxtLink 
                  to="/auth/register" 
                  class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Get Started
                </NuxtLink>
              </template>

              <!-- Show when user IS authenticated -->
              <template v-else>
                <div class="flex items-center space-x-4">
                  <NuxtLink 
                    to="/dashboard" 
                    class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </NuxtLink>
                  
                  <UButton
                    variant="ghost"
                    @click="handleLogout"
                    class="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </UButton>
                </div>
              </template>
            </div>
          </ClientOnly>

          <!-- Mobile menu button -->
          <div class="md:hidden" v-if="showSidebar">
            <UButton
              variant="ghost"
              icon="i-heroicons-bars-3"
              @click="sidebarOpen = true"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Content Area (Desktop: block sidebar) -->
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
              class="group flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
              active-class="bg-green-50 text-green-600"
            >
              <UIcon :name="item.icon" class="w-5 h-5 mr-3" />
              <span>{{ item.label }}</span>
            </NuxtLink>
          </nav>
        </aside>
      </ClientOnly>

      <!-- Main Content -->
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
                class="group flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                active-class="bg-green-50 text-green-600"
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

    

    <!-- Footer -->
    <footer class="bg-gray-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">PropertyManager</h3>
            <p class="text-gray-300 text-sm">
              Streamline your property management with our comprehensive platform.
            </p>
          </div>
          
          <div>
            <h4 class="text-md font-semibold mb-4">Product</h4>
            <ul class="space-y-2 text-sm text-gray-300">
              <li><a href="#" class="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" class="hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-md font-semibold mb-4">Company</h4>
            <ul class="space-y-2 text-sm text-gray-300">
              <li><a href="#" class="hover:text-white transition-colors">About</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-md font-semibold mb-4">Support</h4>
            <ul class="space-y-2 text-sm text-gray-300">
              <li><a href="#" class="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Status</a></li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; 2024 PropertyManager. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'nuxt/app'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'
import { useAuthStore } from '../stores/auth'
import { getTopHeaderNav, getSidebarNav, type UserRole } from '~/utils/navigation'

// Sidebar state
const sidebarOpen = ref(false)

// Stores
const userStore = useUserStore()
const { isLoggedIn, userRole } = storeToRefs(userStore)
const { signout } = useAuthStore()
const router = useRouter()

// Navigation data
const topNavItems = getTopHeaderNav()
const sidebarItems = computed(() => getSidebarNav((userRole.value || 'tenant') as UserRole))
const showSidebar = computed(() => {
  const role = userRole.value
  return role === 'super_admin' || role === 'landlord' || role === 'manager'
})

// Close mobile sidebar on route change
const route = useRoute()
watch(() => route.fullPath, () => {
  sidebarOpen.value = false
})

// Logout handler
const handleLogout = async () => {
  try {
    const result = await signout()
    if (result.success) {
      userStore.clearUser()
      userStore.clearStorage()
      sidebarOpen.value = false
      await router.push('/')
    } else {
      console.error('Logout failed:', result.error)
      userStore.clearUser()
      userStore.clearStorage()
      await router.push('/')
    }
  } catch (error) {
    console.error('Logout error:', error)
    userStore.clearUser()
    userStore.clearStorage()
    await router.push('/')
  }
}
</script>
