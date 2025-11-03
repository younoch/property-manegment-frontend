<template>
  <NuxtImg
    :src="src"
    :alt="alt"
    :class="['block', imgClass]"
    :width="width"
    :height="height"
    :sizes="sizes"
    :loading="loading"
    :format="format"
    :quality="quality"
    :preload="preload"
    @error="handleError"
  />
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  width: {
    type: [Number, String],
    default: null
  },
  height: {
    type: [Number, String],
    default: null
  },
  sizes: {
    type: String,
    default: 'sm:100vw md:50vw lg:800px'
  },
  loading: {
    type: String,
    default: 'lazy',
    validator: (value) => ['lazy', 'eager'].includes(value)
  },
  format: {
    type: String,
    default: 'webp',
    validator: (value) => ['webp', 'avif', 'jpeg', 'png'].includes(value)
  },
  quality: {
    type: [Number, String],
    default: 80,
    validator: (value) => value >= 1 && value <= 100
  },
  preload: {
    type: Boolean,
    default: false
  },
  imgClass: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['error']);

const handleError = (e) => {
  // Fallback to original format if WebP/AVIF fails
  if (props.format !== 'jpeg' && !e.target.src.endsWith('.jpeg') && !e.target.src.endsWith('.jpg')) {
    e.target.src = props.src;
  } else {
    // If fallback also fails, show error placeholder
    e.target.src = '/image-placeholder.svg';
    e.target.alt = 'Image not available';
    e.target.classList.add('bg-gray-100', 'p-4');
  }
  emit('error', e);
};
</script>
