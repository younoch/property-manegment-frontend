<template>
  <div class="min-h-screen bg-white text-gray-900">
    <!-- Public header -->
    <ClientOnly>
      <FeedbackButton v-if="!route.path.includes('onboarding')" />
    </ClientOnly>
    <PublicHeader />

    <!-- Page content -->
    <main class="min-h-[calc(100vh-73px)]">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-100">
      <!-- Cookie Consent Banner (loaded only on client side) -->
      <ClientOnly>
        <template #fallback>
          <!-- Show nothing during SSR/SSG -->
          <div></div>
        </template>
        <CookieConsent />
      </ClientOnly>
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="col-span-2 md:col-span-1">
            <h3 class="font-extrabold text-primary-600 mb-4">LeaseDirector</h3>
            <h3 class="text-sm text-gray-600">Smart property Management made easy for small landlords and property managers.</h3>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Product</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><NuxtLink to="/features" class="hover:text-primary-600">Features</NuxtLink></li>
              <li><NuxtLink to="/pricing" class="hover:text-primary-600">Pricing</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Company</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><NuxtLink to="/about" class="hover:text-primary-600">About Us</NuxtLink></li>
              <!-- <li><NuxtLink to="/blog" class="hover:text-primary-600">Blog</NuxtLink></li> -->
              <!-- <li><NuxtLink to="/careers" class="hover:text-primary-600">Careers</NuxtLink></li> -->
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Support</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><NuxtLink to="/contact" class="hover:text-primary-600">Contact Us</NuxtLink></li>
              <!-- <li><NuxtLink to="/help" class="hover:text-primary-600">Help Center</NuxtLink></li> -->
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
            <a href="https://www.facebook.com/leasedirector/" target="_blank" class="text-gray-400 hover:text-gray-500">
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

<script setup lang="ts">
import { useRoute } from 'vue-router'
import CookieConsent from '~/components/common/CookieConsent.vue';

// Theme is initialized in the theme-init.client.ts plugin
const route = useRoute();
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
