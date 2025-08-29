<template>
  <div class="min-h-screen bg-white text-gray-900">
    <!-- Public header -->
    <header class="border-b border-gray-100">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="text-xl font-bold text-emerald-600">LeaseTrack</NuxtLink>
          <nav class="hidden md:flex items-center space-x-8">
            <NuxtLink to="/" class="text-sm font-medium hover:text-emerald-600 transition-colors">Home</NuxtLink>
            <NuxtLink to="/features" class="text-sm font-medium hover:text-emerald-600 transition-colors">Features</NuxtLink>
            <NuxtLink to="/pricing" class="text-sm font-medium hover:text-emerald-600 transition-colors">Pricing</NuxtLink>
            <NuxtLink to="/about" class="text-sm font-medium hover:text-emerald-600 transition-colors">About</NuxtLink>
            <NuxtLink to="/contact" class="text-sm font-medium hover:text-emerald-600 transition-colors">Contact</NuxtLink>
          </nav>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/auth/login" class="text-sm font-medium hover:text-emerald-600 transition-colors">Log in</NuxtLink>
            <NuxtLink to="/auth/signup" class="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
              Get Started
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Page content -->
    <main class="min-h-[calc(100vh-73px)]">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-100">
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="font-bold text-gray-900 mb-4">LeaseTrack</h3>
            <p class="text-sm text-gray-600">Smart property management made easy for small landlords and property managers.</p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Product</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><NuxtLink to="/features" class="hover:text-emerald-600">Features</NuxtLink></li>
              <li><NuxtLink to="/pricing" class="hover:text-emerald-600">Pricing</NuxtLink></li>
              <li><NuxtLink to="/demo" class="hover:text-emerald-600">Demo</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Company</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><NuxtLink to="/about" class="hover:text-emerald-600">About Us</NuxtLink></li>
              <li><NuxtLink to="/blog" class="hover:text-emerald-600">Blog</NuxtLink></li>
              <li><NuxtLink to="/careers" class="hover:text-emerald-600">Careers</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Support</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><NuxtLink to="/contact" class="hover:text-emerald-600">Contact Us</NuxtLink></li>
              <li><NuxtLink to="/help" class="hover:text-emerald-600">Help Center</NuxtLink></li>
              <li><NuxtLink to="/privacy" class="hover:text-emerald-600">Privacy Policy</NuxtLink></li>
              <li><NuxtLink to="/terms" class="hover:text-emerald-600">Terms of Service</NuxtLink></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm text-gray-500">© 2023 LeaseTrack. All rights reserved.</p>
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
// This layout is for public-facing pages like home, about, contact, etc.
</script>

<style scoped>

</style>
