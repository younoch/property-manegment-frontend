<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
    <img v-for="n in 6" :key="n" :src="`https://picsum.photos/100/100?random=${n+5}`" class="h-6 object-contain mx-auto" :alt="`Logo ${n}`"/>
  </div>
</template>
