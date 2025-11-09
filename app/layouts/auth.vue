<template>
  <div class="min-h-screen flex flex-col lg:flex-row relative">
    <!-- Back to Home Button -->
    <NuxtLink to="/" class="absolute top-4 left-4 z-50 flex items-center bg-white/90 hover:bg-white px-3 py-2 rounded-lg shadow-sm text-gray-700 hover:text-primary-600 transition-all">
      <UIcon name="i-heroicons-arrow-left" class="h-5 w-5 mr-1" />
      <span>Back to Home</span>
    </NuxtLink>
    <!-- Left Side - Branding/Info with Animated Background -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-teal-800 relative overflow-hidden">
      <!-- Animated background elements -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute -top-12 -left-12 w-48 h-48 bg-primary-300/40 blur-2xl rounded-full animate-slow-float"></div>
        <div class="absolute top-20 -right-12 w-64 h-64 bg-teal-200/40 blur-2xl rounded-full animate-slow-float-rev"></div>
        <div class="absolute -bottom-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary-100/60 blur-2xl rounded-full"></div>
      </div>
      
      <div class="relative flex flex-col justify-center px-8 xl:px-12 py-4 xl:py-8 text-white z-10">
        <div class="mb-8 text-center">
          <div class="flex justify-center mb-2">
            <Logo color="text-white" size="w-12 h-12" />
          </div>
          <h1 class="text-3xl xl:text-4xl font-bold mb-2">LeaseDirector</h1>
          <p class="text-lg xl:text-xl text-primary-100">
            Streamline your property management with our all-in-one platform
          </p>
        </div>
        
        <div class="space-y-6">
          <div class="flex items-start">
            <UIcon name="i-heroicons-home" class="h-6 w-6 xl:h-8 xl:w-8 text-primary-100 mr-3 xl:mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 class="font-semibold text-sm xl:text-base">Property Management</h3>
              <p class="text-primary-100 text-sm xl:text-base">Efficiently manage properties, tenants, and maintenance</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <UIcon name="i-heroicons-currency-dollar" class="h-6 w-6 xl:h-8 xl:w-8 text-primary-100 mr-3 xl:mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 class="font-semibold text-sm xl:text-base">Rent Collection</h3>
              <p class="text-primary-100 text-sm xl:text-base">Automated payments and financial tracking</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <UIcon name="i-heroicons-document-text" class="h-6 w-6 xl:h-8 xl:w-8 text-primary-100 mr-3 xl:mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 class="font-semibold text-sm xl:text-base">Document Management</h3>
              <p class="text-primary-100 text-sm xl:text-base">Secure cloud storage for all your documents</p>
            </div>
          </div>
        </div>
        
        <!-- Trust indicators -->
        <div class="mt-4 pt-6 border-t border-primary-500/30">
          <p class="text-primary-100 text-sm mb-4">Trusted by property managers worldwide</p>
          <div class="flex items-center space-x-6">
            <div class="text-center">
              <div class="text-xl font-bold">99.9%</div>
              <div class="text-xs text-primary-200">Uptime</div>
            </div>
            <div class="text-center">
              <div class="text-xl font-bold">24/7</div>
              <div class="text-xs text-primary-200">Support</div>
            </div>
            <div class="text-center">
              <div class="text-xl font-bold">1000+</div>
              <div class="text-xs text-primary-200">Properties</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right Side - Authentication Form -->
    <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
      <div class="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Theme is initialized in the theme-init.client.ts plugin
</script>
