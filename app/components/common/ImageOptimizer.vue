<template>
  <div 
    :class="['image-container', imgClass]" 
    :style="containerStyle"
    :title="alt"
    role="img"
    :aria-label="alt || 'Image'"
  >
    <!-- Main Image -->
    <img
      v-show="!imageError && !isLoading"
      :key="currentSrc"
      ref="imgElement"
      :src="currentSrc"
      :alt="alt"
      :class="['block w-full h-full transition-opacity duration-300', imgClass]"
      :width="width"
      :height="height"
      :loading="loading"
      :style="{ objectFit: fit, objectPosition: position === 'center' ? 'center' : position }"
      @load="onImageLoad"
      @error="handleError"
      :aria-hidden="imageError || isLoading"
    />
    
    <!-- Loading Skeleton -->
    <div 
      v-if="showPlaceholder && !imageError"
      class="absolute inset-0 bg-gray-100 animate-pulse"
      :style="placeholderStyle"
      aria-hidden="true"
    ></div>
    
    <!-- Error State -->
    <div 
      v-if="imageError"
      class="absolute inset-0 flex flex-col items-center justify-center bg-red-50 p-4 text-center"
      :style="placeholderStyle"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-10 w-10 text-red-400 mb-2" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span class="text-sm text-red-600">Couldn't load image</span>
      <button 
        v-if="retryCount > 0 && currentRetry < retryCount"
        @click="retryLoading"
        class="mt-2 px-3 py-1 text-xs bg-white border border-red-200 rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
      >
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

// Type definitions
interface Props {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
  imgClass?: string;
  fit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky' | 'center';
  quality?: number | string;
  fallbackSrc?: string;
  retryCount?: number;
  baseUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  imgClass: '',
  fit: 'cover',
  position: 'center',
  quality: 80,
  fallbackSrc: '',
  retryCount: 1,
  baseUrl: import.meta.env.PROD ? 'https://www.leasedirector.com' : '',
});

const emit = defineEmits(['load', 'error', 'retry']);

// Refs
const imgElement = ref<HTMLImageElement | null>(null);
const isLoading = ref(true);
const showPlaceholder = ref(true);
const imageError = ref(false);
const currentRetry = ref(0);
const currentSrc = ref('');

// Computed
const containerStyle = computed<Record<string, string | number>>(() => ({
  width: props.width ? (typeof props.width === 'string' ? props.width : `${props.width}px`) : '100%',
  height: props.height ? (typeof props.height === 'string' ? props.height : `${props.height}px`) : 'auto',
  position: 'relative' as const,
  overflow: 'hidden',
  backgroundColor: '#f3f4f6', // Light gray background
  borderRadius: '0.25rem', // Rounded corners
  display: 'inline-block', // Ensure proper sizing
  lineHeight: 0, // Remove extra space below image
}));

const placeholderStyle = computed<Record<string, string | number>>(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: props.fit,
  objectPosition: props.position === 'center' ? 'center' : props.position || 'center',
}));

// Methods
const processSrc = (src: string): string => {
  if (!src) return '';
  
  // Handle data URLs, blob URLs, and absolute URLs
  if (src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('http')) {
    return src;
  }
  
  // Handle protocol-relative URLs
  if (src.startsWith('//')) {
    return window.location.protocol + src;
  }
  
  // Prepend base URL for relative paths
  return `${props.baseUrl}${src.startsWith('/') ? '' : '/'}${src}`;
};

const loadImage = (src: string) => {
  if (!src) {
    handleEmptySource();
    return;
  }
  
  const processedSrc = processSrc(src);
  
  // Check if the image is already loaded or loading
  if (currentSrc.value === processedSrc && !imageError.value) {
    return;
  }
  
  // Reset states
  currentSrc.value = processedSrc;
  isLoading.value = true;
  showPlaceholder.value = true;
  imageError.value = false;
};

const onImageLoad = (e: Event) => {
  isLoading.value = false;
  showPlaceholder.value = false;
  imageError.value = false;
  emit('load', e);
};

const handleError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  console.warn('Image failed to load:', target.src);
  
  // Set error state
  imageError.value = true;
  isLoading.value = false;
  
  // Emit error event
  emit('error', { 
    error: e, 
    src: target.src,
    currentRetry: currentRetry.value
  });
  
  // Try fallback if available and we haven't already tried it
  if (props.fallbackSrc && !target.src.includes(props.fallbackSrc)) {
    setTimeout(() => {
      currentRetry.value++;
      currentSrc.value = processSrc(props.fallbackSrc);
      imageError.value = false;
      isLoading.value = true;
    }, 100);
  }
};

const handleEmptySource = () => {
  imageError.value = true;
  isLoading.value = false;
  showPlaceholder.value = true;
  currentSrc.value = '';
};

const retryLoading = () => {
  if (currentRetry.value < (props.retryCount || 0)) {
    currentRetry.value++;
    emit('retry', { 
      retryCount: currentRetry.value,
      maxRetries: props.retryCount 
    });
    
    // Reset and reload the image
    imageError.value = false;
    isLoading.value = true;
    
    // Force re-render by updating the src
    const src = currentSrc.value;
    currentSrc.value = '';
    nextTick(() => {
      currentSrc.value = src;
    });
  }
};

// Watch for source changes
watch(() => props.src, (newSrc) => {
  currentRetry.value = 0; // Reset retry counter when src changes
  loadImage(newSrc);
}, { immediate: true });

// Watch for fallbackSrc changes
watch(() => props.fallbackSrc, (newFallback) => {
  if (imageError.value && newFallback) {
    currentRetry.value = 0;
    loadImage(newFallback);
  }
});
</script>
