<template>
  <div class="p-5 rounded-2xl bg-white/70 backdrop-blur border border-gray-200 shadow-sm">
    <p class="text-2xl font-semibold">{{ value }}</p>
    <p class="text-sm text-gray-600">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ value: string; label: string }>()
</script>
