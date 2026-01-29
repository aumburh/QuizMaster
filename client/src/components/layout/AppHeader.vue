<template>
  <header class="bg-white shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span class="ml-3 text-xl font-bold text-gray-900">QuizMaster</span>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
            Home
          </router-link>
          <router-link to="/quizzes" class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
            Quizzes
          </router-link>
          <router-link to="/leaderboard" class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
            Leaderboard
          </router-link>

          <template v-if="authStore.isAuthenticated">
            <router-link to="/dashboard" class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Dashboard
            </router-link>
            <router-link v-if="authStore.isTeacher" to="/quizzes/create" class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Create Quiz
            </router-link>
            <router-link v-if="authStore.isAdmin" to="/admin" class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Admin
            </router-link>
          </template>
        </div>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <!-- User Avatar and Dropdown -->
            <div class="relative">
              <button
                @click="toggleUserMenu"
                class="flex items-center space-x-2 focus:outline-none"
              >
                <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {{ userInitials }}
                </div>
                <span class="hidden md:block text-sm font-medium text-gray-700">
                  {{ authStore.user?.name || 'User' }}
                </span>
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Profile
                </router-link>
                <router-link
                  to="/dashboard"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Dashboard
                </router-link>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </template>

          <template v-else>
            <router-link
              to="/login"
              class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign Up
            </router-link>
          </template>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 focus:outline-none"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden py-4 space-y-2">
        <router-link
          to="/"
          class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
          @click="showMobileMenu = false"
        >
          Home
        </router-link>
        <router-link
          to="/quizzes"
          class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
          @click="showMobileMenu = false"
        >
          Quizzes
        </router-link>
        <router-link
          to="/leaderboard"
          class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
          @click="showMobileMenu = false"
        >
          Leaderboard
        </router-link>

        <template v-if="authStore.isAuthenticated">
          <router-link
            to="/dashboard"
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
            @click="showMobileMenu = false"
          >
            Dashboard
          </router-link>
          <router-link
            v-if="authStore.isTeacher"
            to="/quizzes/create"
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
            @click="showMobileMenu = false"
          >
            Create Quiz
          </router-link>
          <router-link
            v-if="authStore.isAdmin"
            to="/admin"
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
            @click="showMobileMenu = false"
          >
            Admin
          </router-link>
          <button
            @click="handleLogout"
            class="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
          >
            Logout
          </button>
        </template>

        <template v-else>
          <router-link
            to="/login"
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
            @click="showMobileMenu = false"
          >
            Login
          </router-link>
          <router-link
            to="/register"
            class="block px-3 py-2 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
            @click="showMobileMenu = false"
          >
            Sign Up
          </router-link>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)

const userInitials = computed(() => {
  if (!authStore.user) return 'U'
  const name = authStore.user.name || authStore.user.username || 'User'
  return name.charAt(0).toUpperCase()
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const handleLogout = () => {
  authStore.logout()
  showUserMenu.value = false
  showMobileMenu.value = false
  router.push('/')
}

// Close menus when clicking outside
if (typeof window !== 'undefined') {
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showUserMenu.value = false
    }
  })
}
</script>

<style scoped>
.router-link-active {
  color: #4F46E5;
}
</style>
