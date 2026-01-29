<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Galvene -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Browse Quizzes</h1>
        <p class="text-gray-600">Explore quizzes across various subjects</p>
      </div>

      <!-- Filtri -->
      <div class="mb-6 flex flex-wrap gap-4">
        <div class="flex-1 min-w-[300px]">
          <AppInput
            v-model="searchQuery"
            placeholder="Search quizzes..."
            @input="handleSearch"
          />
        </div>

        <select v-model="selectedCategory" @change="handleFilter" class="px-4 py-2 border rounded-lg">
          <option value="">All Categories</option>
          <option v-for="category in quizStore.categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>

        <select v-model="selectedDifficulty" @change="handleFilter" class="px-4 py-2 border rounded-lg">
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <!-- Viktorīnu režģis -->
      <div v-if="quizStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="bg-white rounded-xl h-64 border border-gray-200" />
        </div>
      </div>

      <div v-else-if="quizStore.quizzes.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
        <p class="text-gray-600">Try adjusting your search or filters</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuizCard
          v-for="quiz in quizStore.quizzes"
          :key="quiz._id"
          :quiz="quiz"
          @click="goToQuiz(quiz._id)"
        />
      </div>

      <!-- Lappušu numerācija -->
      <div v-if="quizStore.pagination.pages > 1" class="mt-8 flex justify-center gap-2">
        <AppButton
          @click="changePage(quizStore.pagination.page - 1)"
          :disabled="quizStore.pagination.page === 1"
          variant="outline"
        >
          Previous
        </AppButton>
        <span class="px-4 py-2 text-gray-700">
          Page {{ quizStore.pagination.page }} of {{ quizStore.pagination.pages }}
        </span>
        <AppButton
          @click="changePage(quizStore.pagination.page + 1)"
          :disabled="quizStore.pagination.page === quizStore.pagination.pages"
          variant="outline"
        >
          Next
        </AppButton>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import QuizCard from '@/components/quiz/QuizCard.vue'

const router = useRouter()
const quizStore = useQuizStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedDifficulty = ref('')

const handleSearch = () => {
  fetchQuizzes()
}

const handleFilter = () => {
  fetchQuizzes()
}

const fetchQuizzes = () => {
  const params = {
    page: quizStore.pagination.page
  }

  if (searchQuery.value) params.search = searchQuery.value
  if (selectedCategory.value) params.category = selectedCategory.value
  if (selectedDifficulty.value) params.difficulty = selectedDifficulty.value

  quizStore.fetchQuizzes(params)
}

const changePage = (page) => {
  quizStore.pagination.page = page
  fetchQuizzes()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToQuiz = (id) => {
  router.push(`/quizzes/${id}`)
}

onMounted(async () => {
  await Promise.all([
    quizStore.fetchQuizzes(),
    quizStore.fetchCategories()
  ])
})
</script>
