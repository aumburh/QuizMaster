<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Galvene -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ roomName }}</h1>
          <p class="text-sm text-gray-600">{{ quizTitle }}</p>
        </div>
        <AppButton variant="danger" size="sm" @click="leaveRoom">
          Leave Room
        </AppButton>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Galvenā spēles zona -->
        <div class="lg:col-span-2">
          <!-- Gaidīšanas stāvoklis -->
          <AppCard v-if="gameState === 'waiting'" padding="lg">
            <div class="text-center py-12">
              <UsersIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Waiting for Players...</h2>
              <p class="text-gray-600 mb-6">
                {{ players.length }} / {{ maxPlayers }} players joined
              </p>
              <AppButton
                v-if="isHost"
                variant="primary"
                size="lg"
                :disabled="players.length < 2"
                @click="startGame"
              >
                Start Game
              </AppButton>
            </div>
          </AppCard>

          <!-- Spēles stāvoklis -->
          <div v-else-if="gameState === 'playing'" class="space-y-6">
            <!-- Progress -->
            <AppCard padding="md">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">
                  Question {{ currentQuestion + 1 }} / {{ totalQuestions }}
                </span>
                <QuizTimer :duration="30" @time-up="handleTimeUp" />
              </div>
            </AppCard>

            <!-- Jautājums -->
            <QuizQuestion
              :question="currentQuestionData"
              :current-index="currentQuestion"
              :total-questions="totalQuestions"
              v-model="currentAnswer"
              @next="submitAnswer"
            />

            <!-- Tiešraides rezultāti -->
            <AppCard padding="md">
              <h3 class="text-sm font-semibold text-gray-700 mb-3">Live Scores</h3>
              <div class="space-y-2">
                <div
                  v-for="player in sortedPlayers"
                  :key="player.id"
                  class="flex items-center justify-between text-sm"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-medium text-primary-700">
                      {{ player.name.charAt(0) }}
                    </div>
                    <span class="font-medium text-gray-900">{{ player.name }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <AppBadge v-if="player.answered" variant="success" size="sm">✓</AppBadge>
                    <span class="font-bold text-gray-900">{{ player.score }}</span>
                  </div>
                </div>
              </div>
            </AppCard>
          </div>

          <!-- Rezultātu statuss -->
          <AppCard v-else-if="gameState === 'finished'" padding="lg">
            <div class="text-center mb-8">
              <TrophyIcon class="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 class="text-3xl font-bold text-gray-900 mb-2">Game Over!</h2>
            </div>

            <!-- Galīgais līderu saraksts -->
            <div class="space-y-3 mb-8">
              <div
                v-for="(player, index) in sortedPlayers"
                :key="player.id"
                :class="[
                  'flex items-center justify-between p-4 rounded-lg',
                  index === 0 ? 'bg-yellow-50 border-2 border-yellow-400' :
                  index === 1 ? 'bg-gray-50 border border-gray-300' :
                  index === 2 ? 'bg-orange-50 border border-orange-300' :
                  'bg-gray-50'
                ]"
              >
                <div class="flex items-center gap-3">
                  <div :class="[
                    'text-2xl font-bold',
                    index === 0 ? 'text-yellow-600' :
                    index === 1 ? 'text-gray-600' :
                    index === 2 ? 'text-orange-600' :
                    'text-gray-400'
                  ]">
                    #{{ index + 1 }}
                  </div>
                  <div>
                    <div class="font-semibold text-gray-900">{{ player.name }}</div>
                    <div class="text-sm text-gray-500">{{ player.correctAnswers }} correct</div>
                  </div>
                </div>
                <div class="text-2xl font-bold text-gray-900">{{ player.score }}</div>
              </div>
            </div>

            <div class="flex gap-4">
              <AppButton variant="secondary" class="flex-1" @click="leaveRoom">
                Leave Room
              </AppButton>
              <AppButton v-if="isHost" variant="primary" class="flex-1" @click="playAgain">
                Play Again
              </AppButton>
            </div>
          </AppCard>
        </div>

        <!-- Sānjosla -->
        <div>
          <AppCard padding="md">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Players ({{ players.length }}/{{ maxPlayers }})
            </h3>
            <div class="space-y-3">
              <div
                v-for="player in players"
                :key="player.id"
                class="flex items-center gap-3"
              >
                <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-medium text-primary-700">
                  {{ player.name.charAt(0) }}
                </div>
                <div class="flex-1">
                  <div class="font-medium text-gray-900">
                    {{ player.name }}
                    <AppBadge v-if="player.isHost" variant="primary" size="sm" class="ml-2">
                      Host
                    </AppBadge>
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ player.status }}
                  </div>
                </div>
              </div>
            </div>
          </AppCard>

          <!-- Tērzēšana (pēc izvēles) -->
          <AppCard padding="md" class="mt-4">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Chat</h3>
            <div class="h-48 overflow-y-auto mb-3 space-y-2">
              <div v-for="msg in chatMessages" :key="msg.id" class="text-sm">
                <span class="font-medium text-gray-900">{{ msg.user }}:</span>
                <span class="text-gray-600 ml-1">{{ msg.message }}</span>
              </div>
            </div>
            <div class="flex gap-2">
              <input
                v-model="chatInput"
                type="text"
                class="input flex-1"
                placeholder="Type a message..."
                @keyup.enter="sendMessage"
              >
              <AppButton variant="primary" size="sm" @click="sendMessage">
                <SendIcon class="w-4 h-4" />
              </AppButton>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Users as UsersIcon, Trophy as TrophyIcon, Send as SendIcon } from 'lucide-vue-next'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import QuizQuestion from '@/components/quiz/QuizQuestion.vue'
import QuizTimer from '@/components/quiz/QuizTimer.vue'
import { useNotificationStore } from '@/stores/notification'

const route = useRoute()
const router = useRouter()
const notificationStore = useNotificationStore()

const roomName = ref('Math Challenge')
const quizTitle = ref('Algebra Basics')
const gameState = ref('waiting') // waiting, playing, finished
const isHost = ref(true)
const maxPlayers = ref(4)
const currentQuestion = ref(0)
const totalQuestions = ref(10)
const currentAnswer = ref(null)
const chatInput = ref('')

const players = ref([
  { id: 1, name: 'You', isHost: true, score: 0, answered: false, status: 'Ready', correctAnswers: 0 },
  { id: 2, name: 'Mike Chen', isHost: false, score: 0, answered: false, status: 'Ready', correctAnswers: 0 }
])

const chatMessages = ref([
  { id: 1, user: 'System', message: 'Welcome to the game!' }
])

const currentQuestionData = ref({
  question: 'What is 2 + 2?',
  type: 'multiple-choice',
  options: ['3', '4', '5', '6'],
  correctAnswer: '4'
})

const sortedPlayers = computed(() => {
  return [...players.value].sort((a, b) => b.score - a.score)
})

const startGame = () => {
  gameState.value = 'playing'
  notificationStore.success('Game Started!', 'Good luck!')
}

const submitAnswer = () => {
// Atzīmēt spēlētāju kā atbildējušu
  players.value[0].answered = true

// Simulējiet citu spēlētāju atbildes
  setTimeout(() => {
    currentQuestion.value++
    if (currentQuestion.value >= totalQuestions.value) {
      gameState.value = 'finished'
    } else {
      players.value.forEach(p => p.answered = false)
    }
  }, 1000)
}

const handleTimeUp = () => {
  submitAnswer()
}

const sendMessage = () => {
  if (chatInput.value.trim()) {
    chatMessages.value.push({
      id: Date.now(),
      user: 'You',
      message: chatInput.value
    })
    chatInput.value = ''
  }
}

const leaveRoom = () => {
  router.push('/multiplayer')
}

const playAgain = () => {
  gameState.value = 'waiting'
  currentQuestion.value = 0
  players.value.forEach(p => {
    p.score = 0
    p.answered = false
    p.correctAnswers = 0
  })
}

onMounted(() => {
// Šeit inicializēt WebSocket savienojumu
  notificationStore.info('Connected', 'You joined the room')
})

onUnmounted(() => {
// Notīrīt WebSocket savienojumu
})
</script>

