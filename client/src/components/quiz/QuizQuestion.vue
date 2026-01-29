<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold text-gray-900">Question {{ currentIndex + 1 }} of {{ totalQuestions }}</h3>
      <AppBadge variant="primary">{{ questionType }}</AppBadge>
    </div>

    <div class="mb-8">
      <h4 class="text-lg font-medium text-gray-900 mb-4">
        {{ question.question }}
      </h4>

      <!-- Multiple Choice / True-False -->
      <div v-if="questionType === 'multiple-choice' || questionType === 'true-false'" class="space-y-3">
        <button
          v-for="(option, index) in question.options"
          :key="index"
          :class="[
            'w-full text-left p-4 rounded-lg border-2 transition-all duration-200',
            selectedAnswer === option
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          ]"
          :disabled="submitted"
          @click="selectAnswer(option)"
        >
          <div class="flex items-center">
            <div :class="[
              'w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center',
              selectedAnswer === option ? 'border-primary-500' : 'border-gray-300'
            ]">
              <div v-if="selectedAnswer === option" class="w-3 h-3 rounded-full bg-primary-500" />
            </div>
            <span class="font-medium text-gray-900">{{ option }}</span>
          </div>
        </button>
      </div>

      <!-- Open Ended -->
      <div v-else-if="questionType === 'open-ended'" class="space-y-3">
        <textarea
          v-model="textAnswer"
          :disabled="submitted"
          class="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 transition-all resize-none"
          placeholder="Type your answer here..."
        />
      </div>
    </div>

    <div class="flex items-center justify-between">
      <AppButton
        v-if="currentIndex > 0"
        variant="secondary"
        @click="emit('previous')"
      >
        <ChevronLeftIcon class="w-4 h-4 mr-1" />
        Previous
      </AppButton>
      <div v-else />

      <AppButton
        variant="primary"
        :disabled="!hasAnswer"
        @click="handleNext"
      >
        {{ isLastQuestion ? 'Submit Quiz' : 'Next' }}
        <ChevronRightIcon v-if="!isLastQuestion" class="w-4 h-4 ml-1" />
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-vue-next'
import AppButton from '@/components/common/AppButton.vue'
import AppBadge from '@/components/common/AppBadge.vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  currentIndex: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  modelValue: {
    type: [String, Number, Array],
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'next', 'previous', 'submit'])

const selectedAnswer = ref(props.modelValue)
const textAnswer = ref(props.modelValue || '')
const submitted = ref(false)

const questionType = computed(() => {
  return props.question.type || 'multiple-choice'
})

const isLastQuestion = computed(() => {
  return props.currentIndex === props.totalQuestions - 1
})

const hasAnswer = computed(() => {
  if (questionType.value === 'open-ended') {
    return textAnswer.value.trim().length > 0
  }
  return selectedAnswer.value !== null && selectedAnswer.value !== undefined
})

const selectAnswer = (option) => {
  selectedAnswer.value = option
  emit('update:modelValue', option)
}

const handleNext = () => {
  const answer = questionType.value === 'open-ended' ? textAnswer.value : selectedAnswer.value
  emit('update:modelValue', answer)

  if (isLastQuestion.value) {
    emit('submit')
  } else {
    emit('next')
  }
}

watch(() => props.modelValue, (newValue) => {
  selectedAnswer.value = newValue
  textAnswer.value = newValue || ''
})

watch(() => props.question, () => {
  selectedAnswer.value = props.modelValue
  textAnswer.value = props.modelValue || ''
})
</script>
<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
</script>

