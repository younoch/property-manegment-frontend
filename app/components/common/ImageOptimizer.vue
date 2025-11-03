<template>
  <img
    :src="src"
    :alt="alt"
    :class="['block', imgClass]"
    :width="width"
    :height="height"
    :loading="loading"
    @error="handleError"
    :style="{
      'object-fit': fit || 'cover',
      'object-position': position || 'center'
    }"
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
  loading: {
    type: String,
    default: 'lazy',
    validator: (value) => ['lazy', 'eager'].includes(value)
  },
  imgClass: {
    type: String,
    default: ''
  },
  fit: {
    type: String,
    default: 'cover',
    validator: (value) => ['cover', 'contain', 'fill', 'inside', 'outside'].includes(value)
  },
  position: {
    type: String,
    default: 'center',
    validator: (value) => [
      'top', 'right top', 'right', 'right bottom', 'bottom', 
      'left bottom', 'left', 'left top', 'center'
    ].includes(value)
  }
});

const emit = defineEmits(['error']);

const handleError = (e) => {
  // If the image fails to load, show error placeholder
  const placeholder = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgZmlsbD0iI2YzZjRmNiI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiLz4KICA8cGF0aCBkPSJNNTAgMTAwYTQ5Ljg5IDQ5Ljg5IDAgMTE5OS43OCAwYTQ5Ljg5IDQ5Ljg5IDAgMDEtOTkuNzggMHoiIGZpbGw9IiNlNWU1ZTUiLz4KICA8cGF0aCBkPSJNMTMxLjQ2IDg4LjU0TDEwMCAxMjBsLTE1LjQyLTE1LjQyYTEwIDEwIDAgMDAtMTQuMTQgMEw1MCAxMDAuODZsMTUuNDIgMTUuNDJhMTAgMTAgMCAwMDE0LjE0IDBMOTIuODMgOTRsMjMuNjQtMjMuNjRhMTAgMTAgMCAwMTE0LjE0IDBsLjg1Ljg1YTEwIDEwIDAgMDEwIDE0LjE0eiIgZmlsbD0iI2I4Y2NmMSIvPgo8L3N2Zz4=';
  
  // Only update if the error is not already showing the placeholder
  if (!e.target.src.includes('data:image/svg+xml')) {
    e.target.src = placeholder;
    e.target.alt = 'Image not available';
    e.target.classList.add('bg-gray-100', 'p-4');
    emit('error', e);
  }
};
</script>
