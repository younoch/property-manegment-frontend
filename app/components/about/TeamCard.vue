<template>
  <div class='p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm'>
    <img :src='img' class='w-full h-44 object-cover rounded-xl border border-gray-200' :alt='name'/>
    <h3 class='mt-3 font-semibold'>{{ name }}</h3>
    <p class='text-xs text-gray-500'>{{ role }}</p>
    <p class='mt-2 text-sm text-gray-700'>{{ bio }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  }
})
</script>
