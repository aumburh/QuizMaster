<template>
  <AppLayout>
    <!-- Varoņu sadaļa -->
    <section class="bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center animate-fade-in">
          <h1 class="text-5xl md:text-6xl font-bold mb-6">
            Master Any Subject with
            <span class="text-primary-200">QuizMaster</span>
          </h1>
          <p class="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Create, take, and compete in quizzes. Track your progress, challenge friends, and become a learning champion.
          </p>
          <div class="flex items-center justify-center gap-4 flex-wrap">
            <RouterLink to="/register">
              <AppButton variant="secondary" size="lg">
                Get Started Free
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </AppButton>
            </RouterLink>
            <RouterLink to="/quizzes">
              <AppButton variant="ghost" size="lg" class="text-white border-2 border-white hover:bg-white hover:text-primary-600">
                Browse Quizzes
              </AppButton>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Funkciju sadaļa -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Why Choose QuizMaster?</h2>
          <p class="text-xl text-gray-600">Everything you need to learn, compete, and excel</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="text-center p-6 rounded-xl border-2 border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
          >
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.iconPath" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Populāras viktorīnas -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Popular Quizzes</h2>
          <RouterLink to="/quizzes">
            <AppButton variant="ghost">
              View All
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </AppButton>
          </RouterLink>
        </div>

        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="bg-white rounded-xl h-48 border border-gray-200" />
          </div>
        </div>

        <div v-else-if="popularQuizzes.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuizCard
            v-for="quiz in popularQuizzes"
            :key="quiz._id"
            :quiz="quiz"
          />
        </div>

        <div v-else class="text-center py-12 text-gray-500">
          <p>No quizzes available yet. Check back soon!</p>
        </div>
      </div>
    </section>

    <!-- Aicinājuma uz darbību sadaļa -->
    <section class="py-20 bg-primary-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
        <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Join thousands of students already mastering their subjects with QuizMaster
        </p>
        <RouterLink to="/register">
          <AppButton variant="secondary" size="lg">
            Create Free Account
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </AppButton>
        </RouterLink>
      </div>
    </section>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/common/AppButton.vue'
import QuizCard from '@/components/quiz/QuizCard.vue'
import { useQuizStore } from '@/stores/quiz'

const quizStore = useQuizStore()
const popularQuizzes = ref([])
const loading = ref(true)

const features = [
  {
    iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    title: 'Rich Quiz Library',
    description: 'Access thousands of quizzes across various subjects and difficulty levels'
  },
  {
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    title: 'Multiplayer Battles',
    description: 'Challenge friends in real-time quiz competitions and climb the leaderboard'
  },
  {
    iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    title: 'Progress Tracking',
    description: 'Monitor your performance with detailed analytics and insights'
  },
  {
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
    title: 'Instant Feedback',
    description: 'Get immediate results and explanations to improve your learning'
  },
  {
    iconPath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    title: 'Achievements',
    description: 'Earn badges and rewards as you complete quizzes and reach milestones'
  },
  {
    iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'Secure Platform',
    description: 'Your data is protected with enterprise-grade security'
  }
]

onMounted(async () => {
  try {
    await quizStore.fetchQuizzes({ limit: 6, sort: '-views' })
    popularQuizzes.value = quizStore.quizzes.slice(0, 6)
  } catch (error) {
    console.error('Failed to fetch quizzes:', error)
  } finally {
    loading.value = false
  }
})
</script>
