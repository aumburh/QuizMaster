import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { quizAPI } from '@/services/api'
import { useNotificationStore } from './notification'

export const useQuizStore = defineStore('quiz', () => {
  const quizzes = ref([])
  const currentQuiz = ref(null)
  const userQuizzes = ref([])
  const featuredQuizzes = ref([])
  const categories = ref([])
  const loading = ref(false)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  const notificationStore = useNotificationStore()

// Iegūt visas viktorīnas
  const fetchQuizzes = async (params = {}) => {
    try {
      loading.value = true
      const response = await quizAPI.getQuizzes(params)

      if (response.data.success) {
        quizzes.value = response.data.quizzes
        if (response.data.pagination) {
          pagination.value = response.data.pagination
        }
      }
    } catch (error) {
      console.error('Fetch quizzes error:', error)
      notificationStore.error(error.response?.data?.message || 'Failed to fetch quizzes')
    } finally {
      loading.value = false
    }
  }

// Iegūt viktorīnu pēc ID
  const fetchQuizById = async (id) => {
    try {
      loading.value = true
      const response = await quizAPI.getQuiz(id)

      if (response.data.success) {
        currentQuiz.value = response.data.quiz
        return response.data.quiz
      }
    } catch (error) {
      console.error('Fetch quiz error:', error)
      notificationStore.error(error.response?.data?.message || 'Failed to fetch quiz')
      throw error
    } finally {
      loading.value = false
    }
  }

// Ielādēt piedāvātās viktorīnas
  const fetchFeaturedQuizzes = async () => {
    try {
      const response = await quizAPI.getFeaturedQuizzes()

      if (response.data.success) {
        featuredQuizzes.value = response.data.quizzes
      }
    } catch (error) {
      console.error('Fetch featured quizzes error:', error)
    }
  }

// Ielādēt lietotāja viktorīnas
  const fetchUserQuizzes = async () => {
    try {
      loading.value = true
      const response = await quizAPI.getUserQuizzes()

      if (response.data.success) {
        userQuizzes.value = response.data.quizzes
      }
    } catch (error) {
      console.error('Fetch user quizzes error:', error)
      notificationStore.error(error.response?.data?.message || 'Failed to fetch your quizzes')
    } finally {
      loading.value = false
    }
  }

// Iegūt kategorijas
  const fetchCategories = async () => {
    try {
      const response = await quizAPI.getCategories()

      if (response.data.success) {
        categories.value = response.data.categories
      }
    } catch (error) {
      console.error('Fetch categories error:', error)
    }
  }

// Izveidot viktorīnu
  const createQuiz = async (quizData) => {
    try {
      loading.value = true
      const response = await quizAPI.createQuiz(quizData)

      if (response.data.success) {
        notificationStore.success('Quiz created successfully!')
        return response.data.quiz
      }
    } catch (error) {
      console.error('Create quiz error:', error)
      notificationStore.error(error.response?.data?.message || 'Failed to create quiz')
      throw error
    } finally {
      loading.value = false
    }
  }

// Atjaunināt viktorīnu
  const updateQuiz = async (id, quizData) => {
    try {
      loading.value = true
      const response = await quizAPI.updateQuiz(id, quizData)

      if (response.data.success) {
        notificationStore.success('Quiz updated successfully!')
        return response.data.quiz
      }
    } catch (error) {
      console.error('Update quiz error:', error)
      notificationStore.error(error.response?.data?.message || 'Failed to update quiz')
      throw error
    } finally {
      loading.value = false
    }
  }

// Dzēst testu
  const deleteQuiz = async (id) => {
    try {
      loading.value = true
      const response = await quizAPI.deleteQuiz(id)

      if (response.data.success) {
        notificationStore.success('Quiz deleted successfully!')
// Noņemt no lokālā stāvokļa
        quizzes.value = quizzes.value.filter(q => q._id !== id)
        userQuizzes.value = userQuizzes.value.filter(q => q._id !== id)
        return true
      }
    } catch (error) {
      console.error('Delete quiz error:', error)
      notificationStore.error(error.response?.data?.message || 'Failed to delete quiz')
      throw error
    } finally {
      loading.value = false
    }
  }

// Iesniegt testu
  const submitQuiz = async (id, answers, timeSpent = 0) => {
    try {
      loading.value = true
      const response = await quizAPI.submitQuiz(id, { answers, timeSpent })

      if (response.data.success) {
        notificationStore.success(`Quiz completed! Score: ${response.data.percentage}%`)
        return response.data
      }
    } catch (error) {
      console.error('Submit quiz error:', error)
      notificationStore.error(error.response?.data?.message || 'Failed to submit quiz')
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    quizzes,
    currentQuiz,
    userQuizzes,
    featuredQuizzes,
    categories,
    loading,
    pagination,
    fetchQuizzes,
    fetchQuizById,
    fetchFeaturedQuizzes,
    fetchUserQuizzes,
    fetchCategories,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    submitQuiz
  }
})
