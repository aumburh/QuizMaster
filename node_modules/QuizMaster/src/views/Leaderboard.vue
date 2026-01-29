<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
        <p class="text-gray-600">Top performers across all quizzes</p>
      </div>

      <!-- Filtri -->
      <div class="flex items-center gap-4 mb-6">
        <Menu as="div" class="relative">
          <MenuButton class="btn btn-secondary btn-md flex items-center gap-2">
            {{ selectedPeriod }}
            <ChevronDownIcon class="w-4 h-4" />
          </MenuButton>
          <MenuItems class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            <MenuItem v-for="period in periods" :key="period" v-slot="{ active }">
              <button
                :class="[active ? 'bg-gray-50' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700']"
                @click="selectedPeriod = period"
              >
                {{ period }}
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>

        <Menu as="div" class="relative">
          <MenuButton class="btn btn-secondary btn-md flex items-center gap-2">
            {{ selectedCategory }}
            <ChevronDownIcon class="w-4 h-4" />
          </MenuButton>
          <MenuItems class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            <MenuItem v-for="category in categories" :key="category" v-slot="{ active }">
              <button
                :class="[active ? 'bg-gray-50' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700']"
                @click="selectedCategory = category"
              >
                {{ category }}
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>

      <!-- Ielādes stāvoklis -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <AppLoading size="lg" />
      </div>

      <!-- Tukšs stāvoklis -->
      <div v-else-if="allLeaderboardData.length === 0" class="text-center py-20">
        <TrophyIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No Results Yet</h3>
        <p class="text-gray-600">Be the first to take a quiz and appear on the leaderboard!</p>
      </div>

      <!-- Līderu saraksta saturs -->
      <div v-else>
        <!-- Labāko 3 vietu ieguvējs -->
        <div v-if="topUsers.length > 0" class="grid grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
          <!-- 2. vieta -->
          <div class="pt-12">
            <AppCard v-if="topUsers[1]" padding="md" class="text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrophyIcon class="w-8 h-8 text-gray-600" />
              </div>
              <div class="text-3xl font-bold text-gray-400 mb-2">2</div>
              <div class="font-semibold text-gray-900">{{ topUsers[1].name }}</div>
              <div class="text-2xl font-bold text-gray-900 mt-2">{{ topUsers[1].score }}</div>
              <div class="text-sm text-gray-500">points</div>
            </AppCard>
          </div>

          <!-- 1. vieta -->
          <div>
            <AppCard v-if="topUsers[0]" padding="md" class="text-center border-2 border-yellow-400 bg-gradient-to-b from-yellow-50 to-white">
              <div class="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrophyIcon class="w-10 h-10 text-yellow-600" />
              </div>
              <div class="text-4xl font-bold text-yellow-600 mb-2">1</div>
              <div class="font-semibold text-gray-900 text-lg">{{ topUsers[0].name }}</div>
              <div class="text-3xl font-bold text-gray-900 mt-2">{{ topUsers[0].score }}</div>
              <div class="text-sm text-gray-500">points</div>
            </AppCard>
          </div>

          <!-- 3. vieta -->
          <div class="pt-12">
            <AppCard v-if="topUsers[2]" padding="md" class="text-center">
              <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrophyIcon class="w-8 h-8 text-orange-600" />
              </div>
              <div class="text-3xl font-bold text-orange-400 mb-2">3</div>
              <div class="font-semibold text-gray-900">{{ topUsers[2].name }}</div>
              <div class="text-2xl font-bold text-gray-900 mt-2">{{ topUsers[2].score }}</div>
              <div class="text-sm text-gray-500">points</div>
            </AppCard>
          </div>
        </div>

        <!-- Pilns līderu saraksts -->
        <AppCard v-if="leaderboardUsers.length > 0" padding="none">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quizzes</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Score</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(user, index) in leaderboardUsers"
                  :key="user.id"
                  :class="[
                    user.isCurrentUser ? 'bg-primary-50' : 'hover:bg-gray-50',
                    'transition-colors'
                  ]"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div :class="[
                      'text-sm font-bold',
                      index < 3 ? 'text-yellow-600' : 'text-gray-900'
                    ]">
                      #{{ index + 4 }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                        <UserIcon class="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">
                          {{ user.name }}
                          <span v-if="user.isCurrentUser" class="ml-2 text-xs text-primary-600">(You)</span>
                        </div>
                        <div class="text-xs text-gray-500">{{ user.role }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ user.quizzesTaken }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <AppBadge :variant="getScoreBadgeVariant(user.avgScore)">
                      {{ user.avgScore }}%
                    </AppBadge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {{ user.score }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </AppCard>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { Trophy as TrophyIcon, User as UserIcon, ChevronDown as ChevronDownIcon } from 'lucide-vue-next'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppLoading from '@/components/common/AppLoading.vue'
import { userAPI } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const selectedPeriod = ref('All Time')
const selectedCategory = ref('All Categories')
const loading = ref(false)
const allLeaderboardData = ref([])

const periods = ['All Time', 'This Month', 'This Week']
const categories = ['All Categories', 'Mathematics', 'Science', 'History', 'Geography', 'Literature', 'Technology']

// Saistīt periodu ar API parametru
const getPeriodParam = (period) => {
  if (period === 'This Week') return 'week'
  if (period === 'This Month') return 'month'
  return 'all'
}

// Iegūt līderu saraksta datus
const fetchLeaderboard = async () => {
  try {
    loading.value = true
    const period = getPeriodParam(selectedPeriod.value)
    const response = await userAPI.getLeaderboard({ period, limit: 50 })

    if (response.data.success) {
      allLeaderboardData.value = response.data.leaderboard.map((item, index) => ({
        id: item.userId,
        name: item.name || item.username,
        username: item.username,
        score: item.totalScore,
        quizzesTaken: item.quizzesTaken,
        avgScore: item.averageScore,
        role: 'Student', // Noklusējuma loma
        isCurrentUser: authStore.user?.id === item.userId.toString() || authStore.user?._id === item.userId.toString(),
        rank: index + 1
      }))
    }
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error)
    notificationStore.show({
      message: 'Failed to load leaderboard data',
      type: 'error'
    })
    allLeaderboardData.value = []
  } finally {
    loading.value = false
  }
}

// top 3 lietotāji
const topUsers = computed(() => {
  return allLeaderboardData.value.slice(0, 3)
})

// Pārējā līderu saraksta daļa (sākot no 4. pozīcijas)
const leaderboardUsers = computed(() => {
  return allLeaderboardData.value.slice(3)
})

const getScoreBadgeVariant = (score) => {
  if (score >= 90) return 'success'
  if (score >= 75) return 'warning'
  return 'danger'
}

// Sekot līdzi perioda izmaiņām
watch(selectedPeriod, () => {
  fetchLeaderboard()
})

// Ielādēt datus piestiprināšanas brīdī
onMounted(() => {
  fetchLeaderboard()
})
</script>

