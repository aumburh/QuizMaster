<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Time Remaining</h3>
      <ClockIcon class="w-5 h-5 text-gray-500" />
    </div>

    <div class="text-center">
      <div
        :class="[
          'text-4xl font-bold mb-2',
          timeWarning ? 'text-red-600 animate-pulse' : 'text-gray-900'
        ]"
      >
        {{ formattedTime }}
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          :class="[
            'h-full transition-all duration-1000',
            timeWarning ? 'bg-red-500' : 'bg-primary-500'
          ]"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>

    <p v-if="timeWarning" class="text-sm text-red-600 text-center mt-3 font-medium">
      ⚠️ Hurry up! Time is running out
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Clock as ClockIcon } from 'lucide-vue-next'

const props = defineProps({
  duration: {
    type: Number,
    required: true // duration in seconds
  },
  autoStart: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['timeUp', 'tick'])

const timeRemaining = ref(props.duration)
const isRunning = ref(false)
let intervalId = null

const formattedTime = computed(() => {
  const minutes = Math.floor(timeRemaining.value / 60)
  const seconds = timeRemaining.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const progress = computed(() => {
  return (timeRemaining.value / props.duration) * 100
})

const timeWarning = computed(() => {
  return timeRemaining.value <= 60 // Warning when 1 minute or less
})

const start = () => {
  if (!isRunning.value) {
    isRunning.value = true
    intervalId = setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--
        emit('tick', timeRemaining.value)

        if (timeRemaining.value === 0) {
          stop()
          emit('timeUp')
        }
      }
    }, 1000)
  }
}

const stop = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
    isRunning.value = false
  }
}

const reset = () => {
  stop()
  timeRemaining.value = props.duration
}

onMounted(() => {
  if (props.autoStart) {
    start()
  }
})

onUnmounted(() => {
  stop()
})

defineExpose({
  start,
  stop,
  reset,
  timeRemaining
})
</script>

