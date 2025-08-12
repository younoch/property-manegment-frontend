<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Branding/Info -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800">
      <div class="flex flex-col justify-center px-12 py-16 text-white">
        <div class="mb-8">
          <h1 class="text-4xl font-bold mb-4">Property Management</h1>
          <p class="text-xl text-primary-100">
            Streamline your property management operations with our comprehensive platform.
          </p>
        </div>
        
        <div class="space-y-6">
          <div class="flex items-center">
            <UIcon name="i-heroicons-home" class="h-8 w-8 text-primary-200 mr-4" />
            <div>
              <h3 class="font-semibold">Property Management</h3>
              <p class="text-primary-200">Efficiently manage properties, tenants, and maintenance</p>
            </div>
          </div>
          
          <div class="flex items-center">
            <UIcon name="i-heroicons-users" class="h-8 w-8 text-primary-200 mr-4" />
            <div>
              <h3 class="font-semibold">Tenant Portal</h3>
              <p class="text-primary-200">Easy access for tenants to manage their accounts</p>
            </div>
          </div>
          
          <div class="flex items-center">
            <UIcon name="i-heroicons-chart-bar" class="h-8 w-8 text-primary-200 mr-4" />
            <div>
              <h3 class="font-semibold">Analytics & Reporting</h3>
              <p class="text-primary-200">Comprehensive insights into your property portfolio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right Side - Authentication Form -->
    <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This layout is used for authentication pages
</script>
