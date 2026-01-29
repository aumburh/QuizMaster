<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Multiplayer Lobby</h1>
      <p class="text-gray-600">Join or create a multiplayer quiz session</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Izveidot sesiju -->
      <AppCard>
        <h2 class="text-xl font-semibold mb-4">Create New Session</h2>
        <form @submit.prevent="createSession" class="space-y-4">
          <AppInput
            v-model="newSession.name"
            label="Session Name"
            placeholder="My Quiz Session"
            required
          />
          <AppInput
            v-model="newSession.quizId"
            label="Quiz ID"
            placeholder="Enter quiz ID"
            required
          />
          <AppInput
            v-model.number="newSession.maxPlayers"
            label="Max Players"
            type="number"
            min="2"
            max="10"
            required
          />
          <AppButton type="submit" variant="primary" class="w-full">
            Create Session
          </AppButton>
        </form>
      </AppCard>

      <!-- Pievienoties sesijai -->
      <AppCard>
        <h2 class="text-xl font-semibold mb-4">Join Existing Session</h2>
        <form @submit.prevent="joinSession" class="space-y-4 mb-6">
          <AppInput
            v-model="sessionCode"
            label="Session Code"
            placeholder="Enter 6-digit code"
            required
          />
          <AppButton type="submit" variant="primary" class="w-full">
            Join Session
          </AppButton>
        </form>

        <!-- Aktīvās sesijas -->
        <div class="border-t pt-4">
          <h3 class="font-medium mb-3">Active Sessions</h3>
          <div v-if="activeSessions.length === 0" class="text-gray-500 text-center py-4">
            No active sessions available
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="session in activeSessions"
              :key="session.id"
              class="p-3 border rounded-lg hover:border-primary-500 cursor-pointer"
              @click="joinSessionById(session.id)"
            >
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium">{{ session.name }}</p>
                  <p class="text-sm text-gray-500">
                    {{ session.players.length }}/{{ session.maxPlayers }} players
                  </p>
                </div>
                <AppBadge>{{ session.code }}</AppBadge>
              </div>
            </div>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppCard from '@/components/common/AppCard.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppBadge from '@/components/common/AppBadge.vue'

const router = useRouter()

const newSession = ref({
  name: '',
  quizId: '',
  maxPlayers: 4
})

const sessionCode = ref('')
const activeSessions = ref([])

const createSession = async () => {
// TODO: Ieviest sesijas izveidi
  console.log('Creating session:', newSession.value)
  // router.push(`/multiplayer/${sessionId}`)
}

const joinSession = async () => {
// TODO: Ieviest apvienošanu, izmantojot kodu
  console.log('Joining session:', sessionCode.value)
  // router.push(`/multiplayer/${sessionId}`)
}

const joinSessionById = (sessionId) => {
  router.push(`/multiplayer/${sessionId}`)
}

onMounted(async () => {
// TODO: Iegūt aktīvās sesijas
  activeSessions.value = []
})
</script>

