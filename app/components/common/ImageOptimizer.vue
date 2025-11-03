<template>
  <div :class="['image-container', imgClass]" :style="{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : 'auto' }">
    <NuxtImg
      :src="src"
      :alt="alt"
      :class="['block w-full h-full object-cover', { 'opacity-0': isLoading }]"
      :width="width"
      :height="height"
      :loading="loading"
      :fit="fit"
      :position="position"
      :sizes="sizes"
      :quality="quality"
      :format="format"
      :preload="preload"
      :placeholder="placeholder"
      :provider="provider"
      @load="onImageLoad"
      @error="handleError"
    />
    <div v-if="showPlaceholder" class="absolute inset-0 bg-gray-100 animate-pulse"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const isLoading = ref(true);
const showPlaceholder = ref(true);

const onImageLoad = () => {
  isLoading.value = false;
  showPlaceholder.value = false;
};

const emit = defineEmits(['error']);

const handleError = (e) => {
  console.error('Image failed to load:', e);
  showPlaceholder.value = true;
  
  // If the image fails to load, emit the error event
  emit('error', e);
  
  // Fallback to a simple error state
  if (e.target) {
    e.target.classList.add('bg-gray-100', 'p-4');
    
    // Only update if we have a valid target and it's not already showing an error state
    if (!e.target.classList.contains('bg-red-50')) {
      e.target.classList.add('bg-red-50', 'border', 'border-red-200');
    }
  }
};

const props = defineProps({
  // Source URL of the image
  src: {
    type: String,
    required: true
  },
  // Alt text for accessibility
  alt: {
    type: String,
    required: true
  },
  // Width of the image (in pixels)
  width: {
    type: [Number, String],
    default: null
  },
  // Height of the image (in pixels)
  height: {
    type: [Number, String],
    default: null
  },
  // Loading behavior
  loading: {
    type: String,
    default: 'lazy',
    validator: (value) => ['lazy', 'eager'].includes(value)
  },
  // Additional CSS classes
  imgClass: {
    type: String,
    default: ''
  },
  // How the image should be resized to fit its container
  fit: {
    type: String,
    default: 'cover',
    validator: (value) => ['cover', 'contain', 'fill', 'inside', 'outside'].includes(value)
  },
  // Position of the image within its container
  position: {
    type: String,
    default: 'center',
    validator: (value) => [
      'top', 'right top', 'right', 'right bottom', 'bottom', 
      'left bottom', 'left', 'left top', 'center'
    ].includes(value)
  },
  // Responsive sizes attribute
  sizes: {
    type: String,
    default: 'sm:100vw md:50vw lg:800px'
  },
  // Image quality (1-100)
  quality: {
    type: [Number, String],
    default: 80,
    validator: (value) => value >= 1 && value <= 100
  },
  // Output format
  format: {
    type: String,
    default: 'webp',
    validator: (value) => ['webp', 'avif', 'jpeg', 'png', 'jpg', 'gif', 'svg'].includes(value)
  },
  // Preload critical images
  preload: {
    type: Boolean,
    default: false
  },
  // Show placeholder while loading
  placeholder: {
    type: [Boolean, String, Array],
    default: true
  },
  // Image provider (ipx, cloudinary, etc.)
  provider: {
    type: String,
    default: 'static'
  }
});


// Generate responsive sizes based on width and height
const generateSizes = (width) => {
  if (!width) return '100vw';
  
  const sizes = [
    `(max-width: 640px) 100vw`,
    `(max-width: 768px) ${Math.min(640, width)}px`,
    `(max-width: 1024px) ${Math.min(768, width)}px`,
    `${Math.min(1024, width)}px`
  ];
  
  return sizes.join(', ');
};

// Use provided sizes or generate based on width
const sizes = computed(() => props.sizes || generateSizes(props.width));
</script>
