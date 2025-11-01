<template>
  <header class="border-b border-gray-100 sticky top-0 bg-white z-40">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Mobile menu button -->
        <div class="flex items-center">
            <Logo class="mr-2" />
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
            <NuxtLink to="/app/dashboard" class="hidden sm:inline-flex px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors">
              Dashboard
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" class="hidden sm:inline-flex text-sm font-medium hover:text-primary-600 transition-colors">
              Log in
            </NuxtLink>
            <NuxtLink to="auth/signup" class="hidden sm:inline-flex px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors">
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
            <nav class="flex-1 overflow-y-auto py-1">
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
                    to="/auth/signup" 
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
                    to="/app/dashboard" 
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
