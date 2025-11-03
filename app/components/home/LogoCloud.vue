<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
    <ImageOptimizer 
      v-for="n in 6" 
      :key="n" 
      :src="`https://picsum.photos/100/100?random=${n+5}`" 
      :alt="`Partner logo ${n}`"
      :width="100"
      :height="100"
      format="webp"
      quality="70"
      img-class="h-10 w-auto object-contain mx-auto"
    />
  </div>
</template>

<script setup>
import ImageOptimizer from '~/components/common/ImageOptimizer.vue';
</script>
