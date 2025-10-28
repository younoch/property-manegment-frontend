<template>
  <div class="min-h-screen flex flex-col lg:flex-row">
    <!-- Left Side - Branding/Info -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-teal-800">
      <div class="flex flex-col justify-center px-8 xl:px-12 py-12 xl:py-16 text-white">
        <div class="mb-8">
          <h1 class="text-3xl xl:text-4xl font-bold mb-4">Property Management Software</h1>
          <p class="text-lg xl:text-xl text-primary-100">
            Streamline your rental Management operations with our comprehensive platform.
          </p>
        </div>
        
        <div class="space-y-6">
          <div class="flex items-start">
            <UIcon name="i-heroicons-home" class="h-6 w-6 xl:h-8 xl:w-8 text-primary-200 mr-3 xl:mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 class="font-semibold text-sm xl:text-base">Property Management Software</h3>
              <p class="text-primary-200 text-sm xl:text-base">Efficiently manage properties, tenants, and maintenance</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <UIcon name="i-heroicons-users" class="h-6 w-6 xl:h-8 xl:w-8 text-primary-200 mr-3 xl:mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 class="font-semibold text-sm xl:text-base">Tenant Portal</h3>
              <p class="text-primary-200 text-sm xl:text-base">Easy access for tenants to manage their accounts</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <UIcon name="i-heroicons-chart-bar" class="h-6 w-6 xl:h-8 xl:w-8 text-primary-200 mr-3 xl:mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 class="font-semibold text-sm xl:text-base">Analytics & Reporting</h3>
              <p class="text-primary-200 text-sm xl:text-base">Comprehensive insights into your property portfolio</p>
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
