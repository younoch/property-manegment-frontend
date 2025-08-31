<template>
  <div class="p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
    <div class="flex items-center gap-3">
      <img :src="avatar" class="h-10 w-10 rounded-full object-cover border border-gray-200" alt="avatar"/>
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
