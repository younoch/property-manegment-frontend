<template>
  <div class="min-h-screen bg-white text-gray-900">
    <!-- Public header -->
    <ClientOnly>
      <FeedbackButton v-if="!route.path.includes('onboarding')" />
    </ClientOnly>
    <header class="border-b border-gray-100 sticky top-0 bg-white z-40">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Mobile menu button -->
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-primary-600">LeaseDirector</NuxtLink>
          </div>
          
          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <NuxtLink to="/" class="text-sm font-medium hover:text-primary-600 transition-colors">Home</NuxtLink>
            <NuxtLink to="/features" class="text-sm font-medium hover:text-primary-600 transition-colors">Features</NuxtLink>
            <NuxtLink to="/pricing" class="text-sm font-medium hover:text-primary-600 transition-colors">Pricing</NuxtLink>
            <NuxtLink to="/about" class="text-sm font-medium hover:text-primary-600 transition-colors">About</NuxtLink>
            <NuxtLink to="/contact" class="text-sm font-medium hover:text-primary-600 transition-colors">Contact</NuxtLink>
          </nav>
          <div class="flex items-center space-x-4">
            <template v-if="isLoggedIn">
              <NuxtLink to="/dashboard" class="hidden sm:inline-flex px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
                Dashboard
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/auth/login" class="hidden sm:inline-flex text-sm font-medium hover:text-primary-600 transition-colors">
                Log in
              </NuxtLink>
              <NuxtLink to="auth/register" class="hidden sm:inline-flex px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
                Get Started
              </NuxtLink>
            </template>
            <!-- Mobile menu toggle -->
            <UButton 
              v-if="!isDrawer"
              class="md:hidden" 
              variant="ghost" 
              color="gray" 
              icon="i-heroicons-bars-3"
              :ui="{ rounded: 'rounded-full' }" 
              @click="isDrawer = true" 
            />
          </div>
          
          <!-- Mobile Menu Drawer -->
          <UDrawer 
            v-model:open="isDrawer" 
            direction="left" 
            :dismissible="false" 
            :handle="false" 
            :ui="{ container: 'gap-0', header: 'flex justify-end', content: 'w-full' }"
          >
            <template #header>
              <UButton color="gray" variant="ghost" class="self-end" icon="i-lucide-x" @click="isDrawer = false" />
            </template>
            <template #body>
              <nav class="flex-1 overflow-y-auto py-4">
                <NuxtLink 
                  v-for="item in navItems" 
                  :key="item.to" 
                  :to="item.to" 
                  class="group flex items-center px-4 py-3 mx-2 rounded-lg text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  :class="{ 'bg-primary-50 text-primary-600': $route.path === item.to }"
                  @click="isDrawer = false"
                >
                  <UIcon :name="item.icon" class="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>{{ item.label }}</span>
                </NuxtLink>
                
                <!-- Mobile Auth Buttons -->
                <div class="mt-4 px-4 space-y-2">
                  <template v-if="!isLoggedIn">
                    <UButton 
                      to="/auth/login" 
                      block 
                      variant="outline"
                      class="justify-center"
                      @click="isDrawer = false"
                    >
                      Log In
                    </UButton>
                    <UButton 
                      to="/auth/register" 
                      block 
                      color="primary"
                      class="justify-center"
                      @click="isDrawer = false"
                    >
                      Get Started
                    </UButton>
                  </template>
                  <template v-else>
                    <UButton 
                      to="/dashboard" 
                      block 
                      color="primary"
                      class="justify-center"
                      @click="isDrawer = false"
                    >
                      Go to Dashboard
                    </UButton>
                  </template>
                </div>
              </nav>
            </template>
          </UDrawer>
        </div>
      </div>
    </header>

    <!-- Page content -->
    <main class="min-h-[calc(100vh-73px)]">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-100">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="col-span-2 md:col-span-1">
            <h3 class="font-bold text-gray-900 mb-4">LeaseDirector</h3>
            <p class="text-sm text-gray-600">Smart property management made easy for small landlords and property managers.</p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Product</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><NuxtLink to="/features" class="hover:text-primary-600">Features</NuxtLink></li>
              <li><NuxtLink to="/pricing" class="hover:text-primary-600">Pricing</NuxtLink></li>
              <li><NuxtLink to="/demo" class="hover:text-primary-600">Demo</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Company</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><NuxtLink to="/about" class="hover:text-primary-600">About Us</NuxtLink></li>
              <li><NuxtLink to="/blog" class="hover:text-primary-600">Blog</NuxtLink></li>
              <li><NuxtLink to="/careers" class="hover:text-primary-600">Careers</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Support</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><NuxtLink to="/contact" class="hover:text-primary-600">Contact Us</NuxtLink></li>
              <li><NuxtLink to="/help" class="hover:text-primary-600">Help Center</NuxtLink></li>
              <li><NuxtLink to="/privacy" class="hover:text-primary-600">Privacy Policy</NuxtLink></li>
              <li><NuxtLink to="/terms" class="hover:text-primary-600">Terms of Service</NuxtLink></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm text-gray-500">© 2023 LeaseDirector. All rights reserved.</p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Twitter</span>
              <UIcon name="i-mdi-twitter" class="h-5 w-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Facebook</span>
              <UIcon name="i-mdi-facebook" class="h-5 w-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">LinkedIn</span>
              <UIcon name="i-mdi-linkedin" class="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const route = useRoute()
const { isLoggedIn } = storeToRefs(userStore)

const isDrawer = ref(false)

const navItems = [
  { to: '/', label: 'Home', icon: 'i-heroicons-home' },
  { to: '/features', label: 'Features', icon: 'i-heroicons-sparkles' },
  { to: '/pricing', label: 'Pricing', icon: 'i-heroicons-currency-dollar' },
  { to: '/about', label: 'About', icon: 'i-heroicons-information-circle' },
  { to: '/contact', label: 'Contact', icon: 'i-heroicons-envelope' },
]
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
