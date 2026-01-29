<template>
  <AppLayout>
    <div v-if="loadingLocal" class="max-w-4xl mx-auto px-4 py-8">
      <AppLoading />
    </div>

    <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <RouterLink to="/dashboard" class="text-primary-600 hover:text-primary-700 font-medium mb-4 inline-flex items-center">
          <ChevronLeftIcon class="w-4 h-4 mr-1" />
          Back to Dashboard
        </RouterLink>
        <h1 class="text-3xl font-bold text-gray-900 mt-4">Edit Quiz</h1>
        <p class="text-gray-600 mt-2">Modify your quiz settings and questions</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Pamatinformācija -->
        <AppCard padding="lg">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

          <div class="space-y-4">
            <AppInput
              v-model="formData.title"
              label="Quiz Title"
              placeholder="e.g., Introduction to Algebra"
              required
              :error="errors.title"
            />

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                v-model="formData.description"
                class="input h-24 resize-none"
                placeholder="Brief description of the quiz..."
                required
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select v-model="formData.category" class="input">
                  <option value="">Select category</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Difficulty</label>
                <select v-model="formData.difficulty" class="input">
                  <option value="">Select difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <AppInput
                v-model.number="formData.timeLimit"
                label="Time Limit (minutes)"
                type="number"
                placeholder="0 = No limit"
                min="0"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AppInput
                v-model.number="formData.passingScore"
                label="Passing Score (%)"
                type="number"
                placeholder="60"
                min="0"
                max="100"
              />

              <div class="flex items-center pt-6">
                <input
                  v-model="formData.isPublic"
                  type="checkbox"
                  id="isPublic"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label for="isPublic" class="ml-2 block text-sm text-gray-700">Make quiz public (visible to all users)</label>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Jautājumi -->
        <AppCard padding="lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Questions</h2>
            <AppButton variant="secondary" size="sm" type="button" @click="addQuestion">
              <PlusIcon class="w-4 h-4 mr-1" />
              Add Question
            </AppButton>
          </div>

          <div v-if="formData.questions.length === 0" class="text-center py-8 text-gray-500">
            <BookOpenIcon class="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No questions yet. Click "Add Question" to get started.</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(question, qIndex) in formData.questions"
              :key="qIndex"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-start justify-between mb-3">
                <h3 class="font-semibold text-gray-900">Question {{ qIndex + 1 }}</h3>
                <button type="button" class="text-red-600 hover:text-red-700" @click="removeQuestion(qIndex)">
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>

              <div class="space-y-3">
                <textarea
                  v-model="question.question"
                  class="input h-20 resize-none"
                  placeholder="Enter your question..."
                  required
                />

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
                    <select v-model="question.type" class="input">
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="true-false">True/False</option>
                      <option value="short-answer">Short Answer</option>
                    </select>
                  </div>

                  <AppInput
                    v-model.number="question.points"
                    label="Points"
                    type="number"
                    min="1"
                    :value="question.points || 1"
                  />
                </div>

                <!-- Iespējas ar atbilžu variantiem -->
                <div v-if="question.type === 'multiple-choice'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Options</label>
                  <div class="space-y-2">
                    <div v-for="(option, oIndex) in question.options" :key="oIndex" class="flex gap-2">
                      <input
                        v-model="question.options[oIndex]"
                        class="input flex-1"
                        :placeholder="`Option ${oIndex + 1}`"
                        required
                      />
                      <button
                        v-if="question.options.length > 2"
                        type="button"
                        class="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                        @click="removeOption(qIndex, oIndex)"
                      >
                        <XIcon class="w-4 h-4" />
                      </button>
                    </div>
                    <AppButton
                      v-if="question.options.length < 6"
                      variant="ghost"
                      size="sm"
                      type="button"
                      @click="addOption(qIndex)"
                    >
                      <PlusIcon class="w-4 h-4 mr-1" />
                      Add Option
                    </AppButton>
                  </div>

                  <div class="mt-3">
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Correct Answer</label>
                    <select v-model="question.correctAnswer" class="input">
                      <option value="">Select correct answer</option>
                      <option v-for="(opt, idx) in question.options" :key="idx" :value="idx">{{ opt || `Option ${idx + 1}` }}</option>
                    </select>
                  </div>
                </div>

                <!-- Iespējas “patiess”/“aplams” -->
                <div v-else-if="question.type === 'true-false'">
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Correct Answer</label>
                  <select v-model="question.correctAnswer" class="input">
                    <option value="">Select correct answer</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>

                <!-- Īsā atbilde -->
                <div v-else-if="question.type === 'short-answer'">
                  <AppInput
                    v-model="question.correctAnswer"
                    label="Correct Answer"
                    placeholder="Enter the correct answer"
                  />
                  <p class="text-xs text-gray-500 mt-1">Note: Answer checking will be case-insensitive</p>
                </div>

                <!-- Paskaidrojums (pēc izvēles) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Explanation (optional)</label>
                  <textarea v-model="question.explanation" class="input h-16 resize-none" placeholder="Explain the correct answer..." />
                </div>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Iesniegt -->
        <div class="flex gap-4">
          <AppButton variant="secondary" type="button" @click="goBack">Cancel</AppButton>
          <AppButton variant="primary" type="submit" :disabled="submitting" class="flex-1">
            <AppLoading v-if="submitting" size="sm" class="mr-2" />
            Save Changes
          </AppButton>
        </div>
      </form>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ChevronLeft as ChevronLeftIcon,
  Plus as PlusIcon,
  Trash as TrashIcon,
  X as XIcon,
  BookOpen as BookOpenIcon
} from 'lucide-vue-next'

import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppLoading from '@/components/common/AppLoading.vue'

import { useQuizStore } from '@/stores/quiz'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const route = useRoute()
const quizStore = useQuizStore()
const notificationStore = useNotificationStore()

const loadingLocal = ref(true)
const submitting = ref(false)
const errors = ref({})

const categories = ref([])

const formData = reactive({
  title: '',
  description: '',
  category: '',
  difficulty: '',
  timeLimit: 0,
  passingScore: 60,
  isPublic: true,
  questions: []
})

const populateForm = (quiz) => {
  // Aizpilda formu ar servera atgriezto quiz objektu.
  formData.title = quiz.title || ''
  formData.description = quiz.description || ''
  formData.category = quiz.category || ''
  formData.difficulty = quiz.difficulty || ''
  formData.timeLimit = quiz.timeLimit || 0
  formData.passingScore = quiz.passingScore != null ? quiz.passingScore : 60
  formData.isPublic = !!quiz.isPublic

  // Normalizēt jautājumus:
  // - nodrošināt, ka katram jautājumam ir lauki -  question, type, options, correctAnswer, points, explanation
  // - ja options nav masīvs, bet jautājuma tips ir 'multiple-choice', izveidojam vismaz 2 tukšas opcijas
  // - correctAnswer var būt skaitlis (index) vai teksta atbilde; ja nav definēts, atstājam to kā tukšu virkni
  formData.questions = (quiz.questions || []).map(q => ({
    // Teksta jautājuma saturs
    question: q.question || '',
    // Tips - 'multiple-choice' | 'true-false' | 'short-answer'
    type: q.type || 'multiple-choice',
    // Opciju masīvs -  ja tas jau ir masīvs, kopējam to; ja nav un tips ir multiple-choice, izveidojam 2 tukšas opcijas
    options: Array.isArray(q.options) ? [...q.options] : (q.type === 'multiple-choice' ? ['', ''] : []),
    // Pareiza atbilde - ja ir definēta (nevis undefined/null), saglabājam to kā ir; citādi tukša virkne
    // Piezīme - multiple-choice korektā atbilde sagaidāma kā indekss (number), bet true/false vai short-answer var būt string
    correctAnswer: q.correctAnswer !== undefined && q.correctAnswer !== null ? q.correctAnswer : '',
    // Punkti par jautājumu — noklusējums 1
    points: q.points || 1,
    // Paskaidrojums (var būt tukšs)
    explanation: q.explanation || ''
  }))
}

const load = async () => {
  try {
    loadingLocal.value = true
// ielādēs kategorijas, ja pieejamas
    await quizStore.fetchCategories().catch(() => {})
    categories.value = quizStore.categories || []

    const quiz = await quizStore.fetchQuizById(route.params.id)
    if (quiz) {
      populateForm(quiz)
    }
  } catch (error) {
    console.error('Load quiz for edit error:', error)
  } finally {
    loadingLocal.value = false
  }
}

onMounted(load)

const addQuestion = () => {
  formData.questions.push({
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 1,
    explanation: ''
  })
}

const removeQuestion = (index) => {
  formData.questions.splice(index, 1)
}

const addOption = (qIndex) => {
  formData.questions[qIndex].options.push('')
}

const removeOption = (qIndex, oIndex) => {
  const question = formData.questions[qIndex]
  question.options.splice(oIndex, 1)

// Pielāgot pareizo atbildi, ja nepieciešams
  if (question.type === 'multiple-choice') {
    if (question.correctAnswer === oIndex) {
      question.correctAnswer = ''
    } else if (typeof question.correctAnswer === 'number' && question.correctAnswer > oIndex) {
      question.correctAnswer = question.correctAnswer - 1
    }
  }
}

const validateForm = () => {
  errors.value = {}

  if (!formData.title || !formData.title.trim()) {
    errors.value.title = 'Quiz title is required'
    return false
  }

  if (formData.questions.length === 0) {
    notificationStore.error('Validation Error', 'Please add at least one question')
    return false
  }

  for (let i = 0; i < formData.questions.length; i++) {
    const q = formData.questions[i]
    if (!q.question || !q.question.trim()) {
      notificationStore.error('Validation Error', `Question ${i + 1} is empty`)
      return false
    }

    if (q.type === 'multiple-choice') {
      const emptyOptions = q.options.filter(opt => !opt || !opt.trim())
      if (emptyOptions.length > 0) {
        notificationStore.error('Validation Error', `Question ${i + 1}: All options must be filled`)
        return false
      }

      if (q.correctAnswer === '' || q.correctAnswer === null || q.correctAnswer === undefined) {
        notificationStore.error('Validation Error', `Question ${i + 1}: Please select the correct answer`)
        return false
      }
    } else if (!q.correctAnswer || q.correctAnswer.toString().trim() === '') {
      notificationStore.error('Validation Error', `Question ${i + 1}: Please provide the correct answer`)
      return false
    }
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true
  try {
    const quizData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      difficulty: formData.difficulty,
      timeLimit: Number(formData.timeLimit) || 0,
      passingScore: Number(formData.passingScore) || 0,
      isPublic: !!formData.isPublic,
      questions: formData.questions.map(q => {
        const qOut = {
          question: q.question.trim(),
          type: q.type,
          points: Number(q.points) || 1,
          explanation: q.explanation?.trim() || ''
        }

        if (q.type === 'multiple-choice') {
          qOut.options = q.options.map(opt => opt.trim())
          qOut.correctAnswer = q.correctAnswer
        } else if (q.type === 'true-false') {
          qOut.correctAnswer = q.correctAnswer
        } else if (q.type === 'short-answer') {
          qOut.correctAnswer = q.correctAnswer?.trim() || ''
        }

        return qOut
      })
    }

    const updated = await quizStore.updateQuiz(route.params.id, quizData)
    if (updated) {
      notificationStore.success('Success', 'Quiz updated successfully')
      router.push(`/quizzes/${route.params.id}`)
    }
  } catch (error) {
    console.error('Update quiz error:', error)
    notificationStore.error('Update Failed', error.response?.data?.message || 'Failed to update quiz')
  } finally {
    submitting.value = false
  }
}

const goBack = () => router.back()
</script>
