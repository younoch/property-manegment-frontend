<template>
  <div class="p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
    <div class="flex items-center gap-3">
      <div class="h-12 w-12 flex-shrink-0">
        <img 
          :src="avatar" 
          :alt="`${name}'s profile picture`"
          class="h-full w-full rounded-full object-cover border-2 border-white shadow-sm"
        />
      </div>
      <div>
        <p class="font-semibold">{{ name }}</p>
        <p class="text-xs text-gray-500">{{ role }}</p>
      </div>
    </div>
    <p class="mt-3 text-gray-700">“{{ quote }}”</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ name: string; role: string; quote: string; avatar: string }>()
</script>
