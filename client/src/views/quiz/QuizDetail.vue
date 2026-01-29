<template>
  <AppLayout>
    <div v-if="quizStore.loading" class="max-w-4xl mx-auto px-4 py-8">
      <AppLoading />
    </div>

    <div v-else-if="quizStore.currentQuiz" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Galvene ar darbībām -->
      <div class="flex items-start justify-between mb-6">
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ quizStore.currentQuiz.title }}
          </h1>
          <p class="text-gray-600">
            {{ quizStore.currentQuiz.description }}
          </p>
        </div>

        <!-- Rediģēšanas/dzēšanas darbības — tikai izveidotājam vai administratoram -->
        <div v-if="canManageQuiz" class="flex gap-2 ml-4">
          <AppButton
            variant="primary"
            size="sm"
            @click="manageResults"
          >
            Manage Results
          </AppButton>
          <AppButton
            variant="outline"
            size="sm"
            @click="editQuiz"
          >
            Edit
          </AppButton>
          <AppButton
            variant="error"
            size="sm"
            @click="showDeleteModal = true"
          >
            Delete
          </AppButton>
        </div>
      </div>

      <!-- Viktorīnas informācija -->
      <AppCard padding="lg" class="mb-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p class="text-sm text-gray-500 mb-1">Category</p>
            <AppBadge variant="primary">{{ quizStore.currentQuiz.category }}</AppBadge>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Difficulty</p>
            <AppBadge :variant="difficultyVariant">
              {{ capitalize(quizStore.currentQuiz.difficulty) }}
            </AppBadge>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Questions</p>
            <p class="font-semibold">{{ quizStore.currentQuiz.questions?.length || 0 }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Attempts</p>
            <p class="font-semibold">{{ quizStore.currentQuiz.totalAttempts || 0 }}</p>
          </div>
        </div>

        <div v-if="quizStore.currentQuiz.tags && quizStore.currentQuiz.tags.length > 0" class="mt-4 pt-4 border-t">
          <p class="text-sm text-gray-500 mb-2">Tags</p>
          <div class="flex flex-wrap gap-2">
            <AppBadge
              v-for="tag in quizStore.currentQuiz.tags"
              :key="tag"
              variant="outline"
            >
              {{ tag }}
            </AppBadge>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t">
          <p class="text-sm text-gray-500">Created by</p>
          <p class="font-medium">
            {{ quizStore.currentQuiz.creator?.name || quizStore.currentQuiz.creator?.username || 'Unknown' }}
          </p>
        </div>
      </AppCard>

      <!-- Jautājumu priekšskatījums -->
      <AppCard padding="lg" class="mb-6">
        <h2 class="text-xl font-semibold mb-4">Questions Preview</h2>
        <div class="space-y-4">
          <div
            v-for="(question, index) in quizStore.currentQuiz.questions"
            :key="index"
            class="p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex items-start justify-between mb-2">
              <p class="font-medium">{{ index + 1 }}. {{ question.question }}</p>
              <AppBadge size="sm">{{ question.points || 1 }} pts</AppBadge>
            </div>
            <p class="text-sm text-gray-500">Type: {{ question.type }}</p>
          </div>
        </div>
      </AppCard>

      <!-- Darbību pogas -->
      <div class="flex gap-4">
        <AppButton
          variant="primary"
          size="lg"
          @click="startQuiz"
          class="flex-1"
        >
          Start Quiz
        </AppButton>
        <AppButton
          variant="outline"
          size="lg"
          @click="goBack"
        >
          Back
        </AppButton>
      </div>
    </div>

    <!-- Dzēšanas apstiprinājuma modālais logs -->
    <AppModal
      :show="showDeleteModal"
      title="Delete Quiz"
      @close="showDeleteModal = false"
    >
      <p class="mb-4">Are you sure you want to delete this quiz? This action cannot be undone.</p>
      <div class="flex justify-end gap-2">
        <AppButton variant="outline" @click="showDeleteModal = false">
          Cancel
        </AppButton>
        <AppButton variant="error" @click="handleDelete" :disabled="deleting">
          {{ deleting ? 'Deleting...' : 'Delete' }}
        </AppButton>
      </div>
    </AppModal>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppLoading from '@/components/common/AppLoading.vue'
import AppModal from '@/components/common/AppModal.vue'

const router = useRouter()
const route = useRoute()
const quizStore = useQuizStore()
const authStore = useAuthStore()

const showDeleteModal = ref(false)
const deleting = ref(false)

// Pārbauda, vai lietotājs var pārvaldīt (rediģēt/dzēst) šo testu
const canManageQuiz = computed(() => {
  if (!authStore.isAuthenticated || !quizStore.currentQuiz) return false

// Administrators var pārvaldīt jebkuru viktorīnu
  if (authStore.isAdmin) return true

// Veidotājs var pārvaldīt savu viktorīnu
  const creatorId = quizStore.currentQuiz.creator?._id || quizStore.currentQuiz.creator
  return creatorId === authStore.user?.id || creatorId === authStore.user?._id
})

const difficultyVariant = computed(() => {
  const variants = {
    easy: 'success',
    medium: 'warning',
    hard: 'error'
  }
  return variants[quizStore.currentQuiz?.difficulty] || 'default'
})

const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const editQuiz = () => {
  router.push(`/quizzes/${route.params.id}/edit`)
}

const manageResults = () => {
  // Navigate to the grading/results view for this quiz
  router.push({ name: 'QuizResults', params: { quizId: route.params.id } })
}

const handleDelete = async () => {
  try {
    deleting.value = true
    await quizStore.deleteQuiz(route.params.id)
    showDeleteModal.value = false
    router.push('/quizzes')
  } catch (error) {
    console.error('Delete error:', error)
  } finally {
    deleting.value = false
  }
}

const startQuiz = () => {
  router.push(`/quizzes/${route.params.id}/take`)
}

const goBack = () => {
  router.back()
}

onMounted(async () => {
  await quizStore.fetchQuizById(route.params.id)
})
</script>
