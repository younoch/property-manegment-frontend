<template>
  <div :class="['relative p-6 rounded-2xl border shadow-sm bg-white/80 backdrop-blur',
                highlight ? 'border-emerald-300 shadow-emerald-100 shadow-xl' : 'border-gray-200']">
    <div v-if="highlight" class="absolute -top-3 right-4 text-xs px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow">Popular</div>
    <h3 class="text-lg font-semibold">{{ title }}</h3>
    <div class="mt-2 flex items-baseline gap-1">
      <span class="text-3xl font-extrabold">{{ price }}</span><span class="text-gray-500">/month</span>
    </div>
    <ul class="mt-4 space-y-2 text-sm text-gray-700">
      <li v-for="(f, i) in features" :key="i" class="flex gap-2">
        <UIcon name="i-heroicons-check-circle" class="text-emerald-600"/> {{ f }}
      </li>
    </ul>
    <div class="mt-5">
      <UButton :color="highlight ? 'emerald' : 'gray'" :variant="highlight ? 'solid' : 'soft'" :to="ctaTo">
        {{ ctaText }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  price: string
  features: string[]
  ctaText: string
  ctaTo: string
  highlight?: boolean
}>()
</script>
