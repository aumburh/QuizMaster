<template>
  <AppLayout>
    <div v-if="loading" class="max-w-4xl mx-auto px-4 py-8">
      <AppLoading />
    </div>

    <div v-else-if="!quiz" class="max-w-4xl mx-auto px-4 py-8 text-center">
      <p class="text-gray-600">Quiz not found</p>
      <AppButton @click="$router.push('/quizzes')" class="mt-4">
        Back to Quizzes
      </AppButton>
    </div>

    <div v-else-if="!started" class="max-w-4xl mx-auto px-4 py-8">
      <!-- Viktorīnas ievads -->
      <AppCard padding="lg">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ quiz.title }}</h1>
        <p class="text-gray-600 mb-6">{{ quiz.description }}</p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p class="text-sm text-gray-500">Questions</p>
            <p class="font-semibold">{{ quiz.questions?.length || 0 }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Difficulty</p>
            <p class="font-semibold capitalize">{{ quiz.difficulty }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Passing Score</p>
            <p class="font-semibold">{{ quiz.passingScore }}%</p>
          </div>
          <div v-if="quiz.timeLimit">
            <p class="text-sm text-gray-500">Time Limit</p>
            <p class="font-semibold">{{ quiz.timeLimit }} min</p>
          </div>
        </div>

        <div class="flex gap-4">
          <AppButton variant="primary" size="lg" @click="startQuiz" class="flex-1">
            Start Quiz
          </AppButton>
          <AppButton variant="outline" size="lg" @click="$router.back()">
            Cancel
          </AppButton>
        </div>
      </AppCard>
    </div>

    <div v-else-if="!submitted" class="max-w-4xl mx-auto px-4 py-8">
      <!-- Viktorīnas galvene -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ quiz.title }}</h1>
        <div class="text-right">
          <p class="text-sm text-gray-500">Question {{ currentQuestionIndex + 1 }} of {{ quiz.questions.length }}</p>
          <div class="w-48 h-2 bg-gray-200 rounded-full mt-1">
            <div
              class="h-full bg-primary-600 rounded-full transition-all"
              :style="{ width: `${progress}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Pašreizējais jautājums -->
      <AppCard padding="lg" class="mb-6">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            {{ currentQuestion.question }}
          </h2>

          <!-- Atbilžu varianti -->
          <div v-if="currentQuestion.type === 'multiple-choice'" class="space-y-3">
            <div
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              @click="selectAnswer(option)"
              :class="[
                'p-4 border-2 rounded-lg cursor-pointer transition-all',
                answers[currentQuestionIndex] === option
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center">
                <div :class=" [
                  'w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center',
                  answers[currentQuestionIndex] === option
                    ? 'border-primary-600 bg-primary-600'
                    : 'border-gray-300'
                ]">
                  <svg v-if="answers[currentQuestionIndex] === option" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <span>{{ option }}</span>
              </div>
            </div>
          </div>

          <!-- Patiesi/Aplami -->
          <div v-else-if="currentQuestion.type === 'true-false'" class="space-y-3">
            <div
              v-for="option in ['True', 'False']"
              :key="option"
              @click="selectAnswer(option)"
              :class="[
                'p-4 border-2 rounded-lg cursor-pointer transition-all',
                answers[currentQuestionIndex] === option
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center">
                <div :class=" [
                  'w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center',
                  answers[currentQuestionIndex] === option
                    ? 'border-primary-600 bg-primary-600'
                    : 'border-gray-300'
                ]">
                  <svg v-if="answers[currentQuestionIndex] === option" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <span>{{ option }}</span>
              </div>
            </div>
          </div>

          <!-- Īsā atbilde -->
          <div v-else-if="currentQuestion.type === 'short-answer'">
            <AppInput
              v-model="answers[currentQuestionIndex]"
              placeholder="Type your answer here..."
              type="text"
            />
          </div>
        </div>
      </AppCard>

      <!-- Navigācija -->
      <div class="flex justify-between">
        <AppButton
          variant="outline"
          @click="previousQuestion"
          :disabled="currentQuestionIndex === 0"
        >
          Previous
        </AppButton>
        <AppButton
          v-if="currentQuestionIndex < quiz.questions.length - 1"
          variant="primary"
          @click="nextQuestion"
        >
          Next
        </AppButton>
        <AppButton
          v-else
          variant="success"
          @click="submitQuiz"
          :disabled="submitting"
        >
          {{ submitting ? 'Submitting...' : 'Submit Quiz' }}
        </AppButton>
      </div>
    </div>

    <!-- Rezultāti -->
    <div v-else class="max-w-4xl mx-auto px-4 py-8">
      <AppCard padding="lg" class="text-center">
        <div class="mb-6">
          <div :class=" [
            'w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4',
            result.passed ? 'bg-green-100' : 'bg-red-100'
          ]">
            <svg v-if="result.passed" class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            {{ result.passed ? 'Congratulations!' : 'Keep Practicing!' }}
          </h2>
          <p class="text-gray-600">
            You scored {{ result.percentage }}% ({{ result.score }}/{{ result.totalPoints }} points)
          </p>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p class="text-sm text-gray-500">Correct</p>
            <p class="text-2xl font-bold text-green-600">
              {{ result.results.filter(r => r.isCorrect).length }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Incorrect</p>
            <p class="text-2xl font-bold text-red-600">
              {{ result.results.filter(r => !r.isCorrect).length }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Score</p>
            <p class="text-2xl font-bold text-gray-900">{{ result.percentage }}%</p>
          </div>
        </div>

        <div class="flex gap-4 justify-center">
          <AppButton variant="primary" @click="retakeQuiz">
            Retake Quiz
          </AppButton>
          <AppButton variant="outline" @click="$router.push('/quizzes')">
            Browse Quizzes
          </AppButton>
        </div>
      </AppCard>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppLoading from '@/components/common/AppLoading.vue'

const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()

// Reaktīvais stāvoklis skata vajadzībām
const loading = ref(true)           // Vai viktorīna vēl tiek ielādēta
const started = ref(false)          // Vai lietotājs sācis viktorīnu
const submitted = ref(false)        // Vai viktorīna jau iesniegta
const submitting = ref(false)       // Iesniegšanas stāvoklis (loading)
const currentQuestionIndex = ref(0) // Indekss uz pašreizējo jautājumu
const answers = ref([])             // Lietotāja atbildes (masīvs)
const quiz = ref(null)              // Ielādētā viktorīnas datu struktūra
const result = ref(null)            // Rezultātu objekts pēc iesniegšanas
const startTime = ref(null)         // Laiks (ms), kad sākta viktorīna
const timeSpent = ref(0)            // Kopējais pavadītais laiks sekundēs

const currentQuestion = computed(() => {
  // Atgriež aktīvo jautājumu vai undefined, ja nav pieejams
  return quiz.value?.questions?.[currentQuestionIndex.value]
})

// Progress indikators procentos
const progress = computed(() => {
  if (!quiz.value?.questions?.length) return 0
  return ((currentQuestionIndex.value + 1) / quiz.value.questions.length) * 100
})

// Sāk viktorīnu - uzstāda started, saglabā sākuma laiku un inicializē answers masīvu
const startQuiz = () => {
  started.value = true
  startTime.value = Date.now()
  // Inicializē atbilžu masīvu ar null vērtībām, viena ieraksta uz jautājumu
  answers.value = new Array(quiz.value.questions.length).fill(null)
}

// Izvēlas atbildi pašreizējam jautājumam
const selectAnswer = (answer) => {
  // Saglabā tieši to formu, kādu atgriež UI (string vai index atkarībā no tipa)
  answers.value[currentQuestionIndex.value] = answer
}

// Pārvietošana uz nākamo jautājumu (ja iespējams)
const nextQuestion = () => {
  if (currentQuestionIndex.value < quiz.value.questions.length - 1) {
    currentQuestionIndex.value++
  }
}

// Atpakaļ uz iepriekšējo jautājumu (ja iespējams)
const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

// Iesniegt viktorīnu - aprēķina pavadīto laiku un nosūta atbildes uz API
const submitQuiz = async () => {
  try {
    submitting.value = true

    // Aprēķinām pavadīto laiku sekundēs, ja ir definēts startTime
    if (startTime.value) {
      timeSpent.value = Math.floor((Date.now() - startTime.value) / 1000)
    }

    // Nosūtam atbildes uz veikalu/servisu, kas izsauks backend
    result.value = await quizStore.submitQuiz(route.params.id, answers.value, timeSpent.value)
    // Pārejam uz rezultātu skatu
    submitted.value = true
  } catch (error) {
    // Konsolē atzīmējam kļūdu; UI kļūdu rādīšana var tikt pievienota veikalam/notifications
    console.error('Submit error:', error)
  } finally {
    submitting.value = false
  }
}

// Atkārtot viktorīnu - atiestata visu saistīto stāvokli
const retakeQuiz = () => {
  started.value = false
  submitted.value = false
  currentQuestionIndex.value = 0
  answers.value = []
  result.value = null
  startTime.value = null
  timeSpent.value = 0
}

// Ielādē viktorīnu, kad komponents montējas
onMounted(async () => {
  try {
    quiz.value = await quizStore.fetchQuizById(route.params.id)
  } catch (error) {
    console.error('Failed to load quiz:', error)
  } finally {
    loading.value = false
  }
})

// Notīra laika rēķināšanas stāvokli, ja tiek demontēts
onUnmounted(() => {
  startTime.value = null
})
</script>
