<template>
  <UNotifications>
    <template #title="{ title }">
      <span class="font-medium">{{ title }}</span>
    </template>
    
    <template #description="{ description }">
      <div class="text-sm">{{ description }}</div>
    </template>
    
    <template #default="{ close, title, description, icon, color, actions }" class="relative">
      <div 
        class="flex items-start gap-3 p-4 rounded-lg"
        :class="[
          color === 'red' ? 'bg-red-50 dark:bg-red-900/30' :
          color === 'green' ? 'bg-green-50 dark:bg-green-900/30' :
          color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/30' :
          'bg-gray-50 dark:bg-gray-800',
        ]"
      >
        <UIcon
          :name="icon"
          class="flex-shrink-0 w-5 h-5 mt-0.5"
          :class="[
            color === 'red' ? 'text-red-500 dark:text-red-400' :
            color === 'green' ? 'text-green-500 dark:text-green-400' :
            color === 'blue' ? 'text-blue-500 dark:text-blue-400' :
            'text-gray-500 dark:text-gray-400',
          ]"
        />
        
        <div class="flex-1 min-w-0">
          <p v-if="title" class="text-sm font-medium text-gray-900 dark:text-gray-100">
            {{ title }}
          </p>
          <p v-if="description" class="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {{ description }}
          </p>
          
          <div v-if="actions?.length" class="flex gap-2 mt-2">
            <UButton
              v-for="(action, index) in actions"
              :key="index"
              v-bind="action"
              size="xs"
              :color="color === 'red' ? 'red' : color === 'green' ? 'green' : color === 'blue' ? 'blue' : 'gray'"
              variant="soft"
              @click="action.click?.()"
            />
          </div>
        </div>
        
        <UButton
          color="gray"
          variant="ghost"
          size="xs"
          icon="i-heroicons-x-mark-20-solid"
          class="flex-shrink-0 -mt-1 -mr-1"
          @click="close"
        />
      </div>
    </template>
  </UNotifications>
</template>

<script setup lang="ts">
// This component provides a consistent notification system
// that matches the application's design system.
// 
// Usage examples:
// 
// Success:
// const { success } = useNotification()
// success('Operation completed', 'Your changes have been saved successfully')
// 
// Error:
// const { error } = useNotification()
// error('Error', 'Something went wrong. Please try again.')
// 
// Info:
// const { info } = useNotification()
// info('Info', 'This is an informational message')
</script>
