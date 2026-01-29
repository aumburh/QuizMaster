<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Galvene -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p class="text-gray-600">Welcome back, {{ user?.username }}! Here's your overview.</p>
      </div>

      <!-- Statistikas režģis -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <AppCard v-for="stat in stats" :key="stat.label" padding="md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ stat.label }}</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>
            </div>
            <div :class="['w-12 h-12 rounded-lg flex items-center justify-center', stat.bgColor]">
              <svg class="w-6 h-6" :class="stat.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="stat.icon === 'BookOpen'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                <path v-else-if="stat.icon === 'Trophy'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                <path v-else-if="stat.icon === 'Clock'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div v-if="stat.change" class="mt-2 flex items-center text-sm">
            <svg
              v-if="stat.changeType === 'up'"
              class="w-4 h-4 mr-1"
              :class="stat.label === 'Rank' ? 'text-green-500' : 'text-red-500'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <svg
              v-else-if="stat.changeType === 'down'"
              class="w-4 h-4 mr-1"
              :class="stat.label === 'Rank' ? 'text-red-500' : 'text-green-500'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <svg
              v-else
              class="w-4 h-4 text-green-500 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span
              :class="[
                'font-medium',
                stat.changeType === 'up' && stat.label === 'Rank' ? 'text-green-600' :
                stat.changeType === 'down' && stat.label === 'Rank' ? 'text-red-600' :
                stat.changeType === 'up' ? 'text-red-600' :
                'text-green-600'
              ]"
            >
              {{ stat.change }}
            </span>
            <span class="text-gray-500 ml-1">vs last week</span>
          </div>
        </AppCard>
      </div>

      <!-- Ātrās darbības -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RouterLink
            v-for="action in quickActions"
            :key="action.label"
            :to="action.path"
            class="group"
          >
            <AppCard hoverable padding="md">
              <div class="flex items-center space-x-4">
                <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', action.bgColor]">
                  <svg class="w-5 h-5" :class="action.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.iconPath" />
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {{ action.label }}
                  </h3>
                  <p class="text-sm text-gray-500">{{ action.description }}</p>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </AppCard>
          </RouterLink>
        </div>
      </div>

      <!-- Jaunākās aktivitātes un līderu saraksts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Jaunākās viktorīnas -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Recent Quizzes</h2>
            <RouterLink to="/quizzes">
              <AppButton variant="ghost" size="sm">View All</AppButton>
            </RouterLink>
          </div>
          <div class="space-y-3">
            <AppCard v-for="quiz in recentQuizzes" :key="quiz._id" padding="md" hoverable>
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">{{ quiz.title }}</h3>
                  <div class="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span>{{ quiz.questions?.length || 0 }} questions</span>
                    <span>•</span>
                    <span>{{ quiz.category }}</span>
                  </div>
                </div>
                <AppBadge :variant="getDifficultyVariant(quiz.difficulty)">
                  {{ quiz.difficulty }}
                </AppBadge>
              </div>
            </AppCard>
          </div>
        </div>

        <!-- Labākie izpildītāji -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Top Performers</h2>
            <RouterLink to="/leaderboard">
              <AppButton variant="ghost" size="sm">View All</AppButton>
            </RouterLink>
          </div>
          <AppCard padding="md">
            <div class="space-y-4">
              <div v-for="(performer, index) in topPerformers" :key="performer.id" class="flex items-center gap-4">
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-gray-100 text-gray-700' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-50 text-gray-600'
                ]">
                  {{ index + 1 }}
                </div>
                <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="font-medium text-gray-900">{{ performer.name }}</div>
                  <div class="text-sm text-gray-500">{{ performer.quizzesTaken }} quizzes</div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-gray-900">{{ performer.score }}</div>
                  <div class="text-xs text-gray-500">points</div>
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
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import { useAuthStore } from '@/stores/auth'
import { useQuizStore } from '@/stores/quiz'
import { userAPI } from '@/services/api'

const authStore = useAuthStore()
const quizStore = useQuizStore()
const { user } = storeToRefs(authStore)

const recentQuizzes = ref([])
const userStats = ref({
  quizzesTaken: 0,
  averageScore: 0,
  totalTimeSpent: 0,
  rank: 0
})
const weeklyComparison = ref({
  quizzesTaken: 0,
  averageScore: 0,
  timeSpent: 0,
  rankChange: 0
})
const topPerformers = ref([])
const loading = ref(true)

const stats = computed(() => {
// Palīgfunkcija laika attēlošanas formatēšanai
  const formatTime = (seconds, unit) => {
    if (unit === 'hours') {
      return `${Math.round(seconds / 3600)}h`
    } else if (unit === 'minutes') {
      return `${Math.round(seconds / 60)}m`
    } else {
      return `${seconds}s`
    }
  }

// Palīgfunkcija laika maiņas formatēšanai
  const formatTimeChange = (seconds, unit) => {
    if (seconds === 0) return null
    const prefix = seconds > 0 ? '+' : ''
    if (unit === 'minutes') {
      return `${prefix}${Math.round(seconds / 60)}m`
    } else {
      return `${prefix}${seconds}s`
    }
  }

  return [
    {
      label: 'Quizzes Taken',
      value: userStats.value.quizzesTaken,
      icon: 'BookOpen',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      change: weeklyComparison.value.quizzesTaken !== 0 ? `${weeklyComparison.value.quizzesTaken > 0 ? '+' : ''}${weeklyComparison.value.quizzesTaken}` : null,
      changeType: null
    },
    {
      label: 'Average Score',
      value: `${userStats.value.averageScore}%`,
      icon: 'Trophy',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      change: weeklyComparison.value.averageScore !== 0 ? `${weeklyComparison.value.averageScore > 0 ? '+' : ''}${weeklyComparison.value.averageScore}%` : null,
      changeType: null
    },
    {
      label: 'Time Spent',
      value: formatTime(userStats.value.totalTimeSpent, userStats.value.totalTimeSpentUnit || 'seconds'),
      icon: 'Clock',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      change: formatTimeChange(weeklyComparison.value.timeSpent, weeklyComparison.value.timeSpentUnit || 'seconds'),
      changeType: null
    },
    {
      label: 'Rank',
      value: `#${userStats.value.rank || '-'}`,
      icon: 'TrendingUp',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      change: weeklyComparison.value.rankChange !== 0
        ? `${Math.abs(weeklyComparison.value.rankChange)}`
        : null,
      changeType: weeklyComparison.value.rankChange > 0
        ? 'up' // Pozitīvas ranga izmaiņas = jūsu uzlabojums (zemāks ranga numurs) = rādīt AUGŠUPVĒRSTO bultiņu (zaļa)
        : weeklyComparison.value.rankChange < 0
          ? 'down' // Negatīvas ranga izmaiņas = jūsu sniegums pasliktinājās (augstāks ranga numurs) = rādīt LEJUPVĒRSTĀS bultiņas (sarkanā krāsā)
          : null
    }
  ]
})

const quickActions = computed(() => {
  const actions = [
    {
      label: 'Browse Quizzes',
      description: 'Find your next challenge',
      path: '/quizzes',
      iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Multiplayer',
      description: 'Challenge your friends',
      path: '/multiplayer',
      iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ]

  if (user.value?.role === 'Teacher' || user.value?.role === 'Admin') {
    actions.push({
      label: 'Create Quiz',
      description: 'Design a new quiz',
      path: '/quizzes/create',
      iconPath: 'M12 4v16m8-8H4',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    })
  } else {
    actions.push({
      label: 'Quick Quiz',
      description: 'Random practice session',
      path: '/quizzes',
      iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    })
  }

  return actions
})

const getDifficultyVariant = (difficulty) => {
  const variants = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  }
  return variants[difficulty?.toLowerCase()] || 'gray'
}

const fetchUserStats = async () => {
  try {
    const response = await userAPI.getCurrentProfile()
    if (response.data.success) {
      userStats.value = response.data.stats
      weeklyComparison.value = response.data.weeklyComparison || {
        quizzesTaken: 0,
        averageScore: 0,
        timeSpent: 0,
        rankChange: 0
      }
    }
  } catch (error) {
    console.error('Failed to fetch user stats:', error)
  }
}

const fetchLeaderboard = async () => {
  try {
    const response = await userAPI.getLeaderboard({ limit: 5 })
    if (response.data.success) {
      topPerformers.value = response.data.leaderboard.map((performer, index) => ({
        id: performer.userId,
        name: performer.name || performer.username,
        score: performer.totalScore,
        quizzesTaken: performer.quizzesTaken
      }))
    }
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error)
  }
}

onMounted(async () => {
  try {
    loading.value = true
    await Promise.all([
      quizStore.fetchQuizzes({ limit: 5 }),
      fetchUserStats(),
      fetchLeaderboard()
    ])
    recentQuizzes.value = quizStore.quizzes.slice(0, 5)
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    loading.value = false
  }
})
</script>
