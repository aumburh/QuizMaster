import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/services/api'
import { useNotificationStore } from './notification'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const notificationStore = useNotificationStore()

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'Admin')
  const isTeacher = computed(() => user.value?.role === 'Teacher' || user.value?.role === 'Admin')

// Inicializēt no lokālās krātuves
  const initAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        console.error('Failed to parse stored user:', e)
        logout()
      }
    }
  }

// Pārbaudīt autentifikācijas statusu
  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      try {
        user.value = JSON.parse(storedUser)
    // Pēc izvēles pārbaudīt žetonu (token) ar aizmugursistēmu (backend)
    // gaidīt fetchCurrentUser()
      } catch (e) {
        console.error('Failed to parse stored user:', e)
        logout()
      }
    }
  }

// Reģistrēt jaunu lietotāju
  const register = async (userData) => {
    try {
      loading.value = true
      const response = await authAPI.register(userData)

      if (response.data.success) {
        token.value = response.data.token
        user.value = response.data.user

        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        notificationStore.show({
          message: 'Registration successful! Welcome to QuizMaster.',
          type: 'success'
        })

        return true
      }
      return false
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      notificationStore.show({
        message,
        type: 'error'
      })
      throw error
    } finally {
      loading.value = false
    }
  }

// Lietotāja pieteikšanās
  const login = async (credentials) => {
    try {
      loading.value = true
      const response = await authAPI.login(credentials)

      if (response.data.success) {
        token.value = response.data.token
        user.value = response.data.user

        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        notificationStore.show({
          message: `Welcome back, ${response.data.user.name}!`,
          type: 'success'
        })

        return true
      }
      return false
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      notificationStore.show({
        message,
        type: 'error'
      })
      throw error
    } finally {
      loading.value = false
    }
  }

// Izrakstīties no lietotāja
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    notificationStore.show({
      message: 'Logged out successfully',
      type: 'info'
    })
  }

// Ielādēt pašreizējo lietotāju
  const fetchCurrentUser = async () => {
    try {
      loading.value = true
      const response = await authAPI.getCurrentUser()

      if (response.data.success) {
        user.value = response.data.user
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error)
      logout()
    } finally {
      loading.value = false
    }
  }

// Atjaunināt lietotāja profilu
  const updateProfile = async (profileData) => {
    try {
      loading.value = true
      const response = await authAPI.updateProfile(profileData)

      if (response.data.success) {
        user.value = response.data.user
        localStorage.setItem('user', JSON.stringify(response.data.user))

        notificationStore.show({
          message: 'Profile updated successfully',
          type: 'success'
        })

        return true
      }
      return false
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile'
      notificationStore.show({
        message,
        type: 'error'
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    isTeacher,
    initAuth,
    checkAuth,
    register,
    login,
    logout,
    fetchCurrentUser,
    updateProfile
  }
})
