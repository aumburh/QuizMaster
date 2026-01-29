<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto px-4 py-8">
      <AppCard v-if="loading" class="text-center">
        <AppLoading />
      </AppCard>

      <div v-else>
        <div v-if="!quiz">
          <AppCard class="text-center">Quiz not found</AppCard>
        </div>

        <div v-else>
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-2xl font-bold">Results — {{ quiz.title }}</h1>
              <p class="text-sm text-gray-500">Manage short-answer grading for this quiz</p>
            </div>
            <div>
              <AppButton variant="outline" @click="goBack">Back</AppButton>
            </div>
          </div>

          <AppCard class="mb-6">
            <div v-if="!canManageQuiz" class="text-center py-8">
              <p class="text-gray-600">You are not authorized to view or grade results for this quiz.</p>
            </div>

            <div v-else>
              <div v-if="results.length === 0" class="text-center py-8">
                <p class="text-gray-600">No results yet.</p>
              </div>

              <div v-else class="space-y-4">
                <div v-for="res in results" :key="res._id" class="p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center justify-between mb-2">
                    <div>
                      <p class="font-medium">{{ res.user?.name || res.user?.username || 'User' }}</p>
                      <p class="text-sm text-gray-500">{{ formatDate(res.completedAt) }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm text-gray-500">Score</p>
                      <p class="font-semibold">{{ res.score }} pts — {{ res.percentage }}%</p>
                    </div>
                  </div>

                  <div class="mt-3 space-y-2">
                    <div v-for="ans in res.answers" :key="ans.questionIndex" class="p-3 bg-white rounded border">
                      <p class="text-sm text-gray-700 font-medium">Q{{ ans.questionIndex + 1 }}:</p>
                      <p class="text-sm text-gray-600 mb-2">Answer: <span class="font-medium">{{ ans.userAnswer }}</span></p>

                      <div class="flex items-center gap-3">
                        <p class="text-sm">Status:</p>
                        <div>
                          <span v-if="ans.isCorrect === true" class="text-green-600 font-semibold">Correct</span>
                          <span v-else-if="ans.isCorrect === false" class="text-red-600 font-semibold">Incorrect</span>
                          <span v-else class="text-yellow-600 font-semibold">Pending</span>
                        </div>

                        <div v-if="ans.isCorrect === null" class="ml-auto flex gap-2">
                          <AppButton size="sm" variant="success" @click="grade(res._id, ans.questionIndex, true)" :loading="grading[res._id + '_' + ans.questionIndex]">Mark Correct</AppButton>
                          <AppButton size="sm" variant="error" @click="grade(res._id, ans.questionIndex, false)" :loading="grading[res._id + '_' + ans.questionIndex]">Mark Incorrect</AppButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppLoading from '@/components/common/AppLoading.vue'
import { useAuthStore } from '@/stores/auth'
import { useQuizStore } from '@/stores/quiz'
import { quizAPI } from '@/services/api'
import { useNotificationStore } from '@/stores/notification'

const route = useRoute()
const router = useRouter()
const quizId = route.params.quizId || route.params.id

const authStore = useAuthStore()
const quizStore = useQuizStore()
const notificationStore = useNotificationStore()

const loading = ref(true)
const quiz = ref(null)
const results = ref([])
const grading = ref({})

const canManageQuiz = computed(() => {
  if (!authStore.isAuthenticated || !quiz.value) return false
  if (authStore.isAdmin) return true
  const creatorId = quiz.value.creator?._id || quiz.value.creator
  return creatorId === authStore.user?.id || creatorId === authStore.user?._id
})

const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleString()
}

const load = async () => {
  try {
    loading.value = true
// Pārliecinieties, ka tests ir ielādēts
    try {
      await quizStore.fetchQuizById(quizId)
      quiz.value = quizStore.currentQuiz
    } catch (e) {
// rezerves variants: ielādēt, izmantojot API
      const resp = await quizAPI.getQuiz(quizId)
      quiz.value = resp.data.quiz
    }

    if (canManageQuiz.value) {
      const resp = await quizAPI.getQuizResults(quizId)
      results.value = resp.data.results || []
    }
  } catch (error) {
    console.error('Load results error:', error)
    notificationStore.error(error.response?.data?.message || 'Failed to load results')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  load()
})

const grade = async (resultId, questionIndex, isCorrect) => {
  const key = resultId + '_' + questionIndex
  grading.value[key] = true
  try {
    await quizAPI.gradeResult(quizId, resultId, { questionIndex, isCorrect })
    notificationStore.success('Graded successfully')
// Atjaunināt lokālo rezultātu ierakstu
    const r = results.value.find(x => x._id === resultId)
    if (r) {
      const a = r.answers.find(x => x.questionIndex === questionIndex)
      if (a) a.isCorrect = isCorrect
// atkārtoti aprēķināt rezultātu/procentuālo daļu
      const resp = await quizAPI.getResult(quizId, resultId)
      const updated = resp.data.result
      const idx = results.value.findIndex(x => x._id === resultId)
      if (idx !== -1) results.value.splice(idx, 1, updated)
    }
  } catch (error) {
    console.error('Grade error:', error)
    notificationStore.error(error.response?.data?.message || 'Failed to grade')
  } finally {
    grading.value[key] = false
  }
}

const goBack = () => router.push(`/quizzes/${quizId}`)
</script>
