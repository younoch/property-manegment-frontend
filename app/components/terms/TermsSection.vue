<template>
  <section :id="id" class='mt-10'>
    <div class='p-6 md:p-7 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm'>
      <h2 class='text-xl md:text-2xl font-bold'>{{ title }}</h2>
      <div class='mt-3'><slot /></div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  title: string
}>()
</script>
