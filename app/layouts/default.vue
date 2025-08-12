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
          <nav class="hidden md:flex space-x-8">
            <NuxtLink 
              to="/" 
              class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-green-600 bg-green-50"
            >
              Home
            </NuxtLink>
            
            <NuxtLink 
              to="/about" 
              class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-green-600 bg-green-50"
            >
              About
            </NuxtLink>
            
            <NuxtLink 
              to="/features" 
              class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-green-600 bg-green-50"
            >
              Features
            </NuxtLink>
            
            <NuxtLink 
              to="/pricing" 
              class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-green-600 bg-green-50"
            >
              Pricing
            </NuxtLink>
            
            <NuxtLink 
              to="/contact" 
              class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-green-600 bg-green-50"
            >
              Contact
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
          <div class="md:hidden">
            <UButton
              variant="ghost"
              icon="i-heroicons-bars-3"
              @click="mobileMenuOpen = !mobileMenuOpen"
            />
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            <NuxtLink 
              to="/" 
              class="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              Home
            </NuxtLink>
            
            <NuxtLink 
              to="/about" 
              class="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              About
            </NuxtLink>
            
            <NuxtLink 
              to="/features" 
              class="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              Features
            </NuxtLink>
            
            <NuxtLink 
              to="/pricing" 
              class="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              Pricing
            </NuxtLink>
            
            <NuxtLink 
              to="/contact" 
              class="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              Contact
            </NuxtLink>
            <NuxtLink 
              to="/cookie-test" 
              class="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
            Cookie Test
            </NuxtLink>
            
            <div class="pt-4 border-t border-gray-200">
              <!-- Show when user is NOT authenticated -->
              <template v-if="!isLoggedIn">
                <NuxtLink 
                  to="/auth/login" 
                  class="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                  @click="mobileMenuOpen = false"
                >
                  Sign In
                </NuxtLink>
                
                <NuxtLink 
                  to="/auth/register" 
                  class="bg-green-600 hover:bg-green-700 text-white block px-3 py-2 rounded-md text-base font-medium mt-2"
                  @click="mobileMenuOpen = false"
                >
                  Get Started
                </NuxtLink>
              </template>

              <!-- Show when user IS authenticated -->
              <template v-else>
                <NuxtLink 
                  to="/dashboard" 
                  class="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                  @click="mobileMenuOpen = false"
                >
                  Dashboard
                </NuxtLink>
                
                <UButton
                  variant="ghost"
                  @click="handleLogout"
                  class="text-gray-700 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium mt-2 w-full text-left"
                >
                  Logout
                </UButton>
              </template>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

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
// Import Nuxt composables
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'nuxt/app'

// Mobile menu state
const mobileMenuOpen = ref(false)

// Import stores and composables
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'
import { useAuthStore } from '../stores/auth'

const userStore = useUserStore()
const { isLoggedIn } = storeToRefs(userStore)
const { signout } = useAuthStore()
const router = useRouter()

// Close mobile menu when route changes
const route = useRoute()
watch(() => route.fullPath, () => {
  mobileMenuOpen.value = false
})

// Logout handler
const handleLogout = async () => {
  try {
    const result = await signout()
    
    if (result.success) {
      userStore.clearUser()
      userStore.clearStorage()
      
      mobileMenuOpen.value = false
      
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
