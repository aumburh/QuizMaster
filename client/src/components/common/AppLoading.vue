<template>
  <div class="flex items-center justify-center" :class="containerClasses">
    <div :class="spinnerClasses" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  fullScreen: {
    type: Boolean,
    default: false
  }
})

const containerClasses = computed(() => {
  return props.fullScreen ? 'min-h-screen' : 'py-8'
})

const spinnerClasses = computed(() => {
  const base = 'animate-spin rounded-full border-t-2 border-b-2 border-primary-600'
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  }
  return `${base} ${sizes[props.size]}`
})
</script>
