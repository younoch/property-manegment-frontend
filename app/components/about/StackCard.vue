<template>
  <div class='p-5 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm'>
    <h3 class='font-semibold text-lg'>{{ title }}</h3>
    <p class='mt-2 text-sm text-gray-600'>{{ items }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: String,
    required: true
  }
})
</script>
