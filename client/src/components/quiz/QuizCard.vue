<template>
  <AppCard class="cursor-pointer hover:shadow-lg transition-shadow duration-200" @click="handleClick">
    <div class="space-y-4">
      <!-- Quiz Header -->
      <div>
        <div class="flex items-start justify-between mb-2">
          <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
            {{ quiz.title }}
          </h3>
          <AppBadge v-if="quiz.isFeatured" variant="success">Featured</AppBadge>
        </div>
        <p class="text-sm text-gray-600 line-clamp-2">
          {{ quiz.description || 'No description available' }}
        </p>
      </div>

      <!-- Quiz Meta -->
      <div class="flex flex-wrap gap-2">
        <AppBadge variant="primary">{{ quiz.category || 'General' }}</AppBadge>
        <AppBadge :variant="difficultyVariant">{{ capitalizeFirst(quiz.difficulty) }}</AppBadge>
        <AppBadge variant="outline">{{ quiz.questions?.length || 0 }} Questions</AppBadge>
      </div>

      <!-- Stats -->
      <div class="flex items-center justify-between text-sm text-gray-500 pt-3 border-t">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>{{ quiz.totalAttempts || 0 }}</span>
          </div>
          <div v-if="quiz.averageRating > 0" class="flex items-center gap-1">
            <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{{ quiz.averageRating.toFixed(1) }}</span>
          </div>
        </div>
        <div v-if="quiz.creator" class="text-xs">
          by {{ quiz.creator.name || quiz.creator.username }}
        </div>
      </div>

      <!-- Action Buttons (shown when showActions is true and user can manage) -->
      <div v-if="showActions && canManageQuiz" class="flex gap-2 pt-3 border-t" @click.stop>
        <AppButton
          variant="outline"
          size="sm"
          @click="$emit('edit', quiz._id)"
          class="flex-1"
        >
          Edit
        </AppButton>
        <AppButton
          variant="error"
          size="sm"
          @click="$emit('delete', quiz._id)"
          class="flex-1"
        >
          Delete
        </AppButton>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppCard from '@/components/common/AppCard.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppButton from '@/components/common/AppButton.vue'

const props = defineProps({
  quiz: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'edit', 'delete'])

const authStore = useAuthStore()

// Check if user can manage this quiz
const canManageQuiz = computed(() => {
  if (!authStore.isAuthenticated || !props.quiz) return false

  // Admin can manage any quiz
  if (authStore.isAdmin) return true

  // Creator can manage their own quiz
  const creatorId = props.quiz.creator?._id || props.quiz.creator
  return creatorId === authStore.user?.id || creatorId === authStore.user?._id
})

const difficultyVariant = computed(() => {
  const variants = {
    easy: 'success',
    medium: 'warning',
    hard: 'error'
  }
  return variants[props.quiz.difficulty] || 'default'
})

const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const handleClick = () => {
  emit('click')
}
</script>
