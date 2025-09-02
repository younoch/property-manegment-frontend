<template>
  <transition name="fade" @after-leave="onAfterLeave">
    <div v-show="show" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <!-- Modal content -->
      <div
        class="bg-gradient-to-br from-white/90 via-white/80 to-white/90 p-8 rounded-3xl shadow-2xl text-center max-w-md mx-4 relative z-10 backdrop-blur-md border border-white/30">
        <!-- Heading -->
        <h2 class="text-3xl font-extrabold mt-0 mb-4 animate-bounce">
          🎉 You're All Set! 🎉
        </h2>

        <!-- Subtext -->
        <p class="text-gray-700 text-base mb-6 leading-relaxed">
          You’re ready to manage your properties efficiently and track your portfolio with ease.
        </p>

        <!-- Action Button -->
        <button @click="close"
          class="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300">
          Start Managing Properties
        </button>
      </div>
      <!-- Confetti canvas -->
      <canvas ref="confettiCanvas" class="fixed inset-0 w-full h-full z-[9998] pointer-events-none"></canvas>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import confetti from 'canvas-confetti'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{ close: [] }>()
const confettiCanvas = ref<HTMLCanvasElement | null>(null)

const close = () => emit('close')
const onAfterLeave = () => console.log('Modal fully closed')

const colors = [
  '#FF3B30', 
  '#007AFF', 
  '#FFCC00', 
  '#FF2D55', 
  '#5856D6', 
]

// const colors = [
//   '#34C759',
//   '#AF52DE',
//   '#FF9500',
//   '#5AC8FA',
//   '#FF3A66'
// ]


function startConfetti() {
  if (!confettiCanvas.value) return

  const myConfetti = confetti.create(confettiCanvas.value, { resize: true, useWorker: true })
  const count = 200
  const defaults = { origin: { y: 0.7 } }

  function fire(particleRatio: number, opts: any) {
    myConfetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      colors
    })
  }

  fire(0.25, { spread: 26, startVelocity: 55 })
  fire(0.2, { spread: 60 })
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  fire(0.1, { spread: 120, startVelocity: 45 })
}

onMounted(() => {
  if (props.show) {
    startConfetti()
  }

  // Auto close modal after 5s
  setTimeout(() => close(), 7000)
})

watch(() => props.show, async val => {
  if (val && confettiCanvas.value) {
    await nextTick()
    startConfetti()
  }
})
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
