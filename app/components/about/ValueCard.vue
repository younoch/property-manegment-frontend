<template>
  <div class='group relative p-5 rounded-2xl bg-white/70 backdrop-blur border border-gray-200 shadow-sm hover:shadow-md transition'>
    <div class='absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition'></div>
    <div class='relative flex items-start gap-3'>
      <UIcon :name='icon' class='text-emerald-600 mt-1' />
      <div>
        <h3 class='font-semibold'>{{ title }}</h3>
        <p class='mt-1 text-sm text-gray-600'>{{ desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  }
})
</script>
