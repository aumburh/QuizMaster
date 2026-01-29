<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Galvene -->
      <div>
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            sign in to your account
          </router-link>
        </p>
      </div>

      <!-- Reģistrācijas veidlapa -->
      <AppCard padding="lg">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Vārda lauks -->
          <AppInput
            v-model="formData.name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            required
            :error="errors.name"
          />

          <!-- Lietotājvārda lauks -->
          <AppInput
            v-model="formData.username"
            label="Username"
            type="text"
            placeholder="johndoe"
            required
            :error="errors.username"
          />

          <!-- E-pasta lauks -->
          <AppInput
            v-model="formData.email"
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            required
            :error="errors.email"
          />

          <!-- Lomas izvēle -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              I am a
            </label>
            <div class="grid grid-cols-2 gap-4">
              <!-- Studentu karte -->
              <button
                type="button"
                @click="formData.role = 'Student'"
                :class="[
                  'relative p-4 border-2 rounded-lg transition-all duration-200 flex flex-col items-center justify-center space-y-2 hover:shadow-md',
                  formData.role === 'Student'
                    ? 'border-primary-500 bg-primary-50 shadow-md ring-2 ring-primary-500 ring-opacity-50'
                    : 'border-gray-200 hover:border-primary-300 bg-white'
                ]"
              >
                <div :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                  formData.role === 'Student' ? 'bg-primary-100' : 'bg-gray-100'
                ]">
                  <svg :class="[
                    'w-6 h-6',
                    formData.role === 'Student' ? 'text-primary-600' : 'text-gray-600'
                  ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span :class="[
                  'font-medium text-sm',
                  formData.role === 'Student' ? 'text-primary-700' : 'text-gray-700'
                ]">
                  Student
                </span>
                <span class="text-xs text-gray-500 text-center">
                  Take quizzes & learn
                </span>
                <!-- Pārbaudes ikona -->
                <div v-if="formData.role === 'Student'"
                  class="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </button>

              <!-- Skolotāja karte -->
              <button
                type="button"
                @click="formData.role = 'Teacher'"
                :class="[
                  'relative p-4 border-2 rounded-lg transition-all duration-200 flex flex-col items-center justify-center space-y-2 hover:shadow-md',
                  formData.role === 'Teacher'
                    ? 'border-primary-500 bg-primary-50 shadow-md ring-2 ring-primary-500 ring-opacity-50'
                    : 'border-gray-200 hover:border-primary-300 bg-white'
                ]"
              >
                <div :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                  formData.role === 'Teacher' ? 'bg-primary-100' : 'bg-gray-100'
                ]">
                  <svg :class="[
                    'w-6 h-6',
                    formData.role === 'Teacher' ? 'text-primary-600' : 'text-gray-600'
                  ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span :class="[
                  'font-medium text-sm',
                  formData.role === 'Teacher' ? 'text-primary-700' : 'text-gray-700'
                ]">
                  Teacher
                </span>
                <span class="text-xs text-gray-500 text-center">
                  Create & manage quizzes
                </span>
                <!-- Pārbaudes ikona -->
                <div v-if="formData.role === 'Teacher'"
                  class="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </button>
            </div>
            <p v-if="errors.role" class="mt-2 text-sm text-red-600">{{ errors.role }}</p>
          </div>

          <!-- Paroles lauks -->
          <AppInput
            v-model="formData.password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            :error="errors.password"
          />

          <!-- Paroles apstiprināšanas lauks -->
          <AppInput
            v-model="formData.confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            required
            :error="errors.confirmPassword"
          />

          <!-- Noteikumi un nosacījumi -->
          <div class="flex items-start">
            <input
              id="terms"
              v-model="formData.acceptTerms"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-700">
              I agree to the
              <RouterLink to="/terms-and-conditions" class="text-primary-600 hover:text-primary-500">Terms and Conditions</RouterLink>
              and
              <RouterLink to="/privacy-policy" class="text-primary-600 hover:text-primary-500">Privacy Policy</RouterLink>
            </label>
          </div>
          <p v-if="errors.acceptTerms" class="text-sm text-red-600">{{ errors.acceptTerms }}</p>

          <!-- Iesniegšanas poga -->
          <AppButton
            type="submit"
            variant="primary"
            size="lg"
            :disabled="loading"
            class="w-full"
          >
            <AppLoading v-if="loading" size="sm" class="mr-2" />
            {{ loading ? 'Creating account...' : 'Create account' }}
          </AppButton>
          <div class="mt-4 text-center">
            <router-link to="/" class="text-sm text-primary-600 hover:text-primary-500 underline-offset-2">
              Go back to home
            </router-link>
          </div>
        </form>
      </AppCard>
      <!-- Kājene -->
      <div class="text-center">
        <p class="text-sm text-gray-600">
          By signing up, you agree to our terms and privacy policy
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppCard from '@/components/common/AppCard.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppLoading from '@/components/common/AppLoading.vue'

const router = useRouter()
const authStore = useAuthStore()

const formData = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: '',
  role: ''
})

const errors = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: '',
  role: ''
})

const loading = ref(false)

const validateForm = () => {
  let isValid = true

// Atiestatīt kļūdas
  Object.keys(errors).forEach(key => errors[key] = '')

// Validēt vārdu
  if (!formData.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  }

// Lietotājvārda validēšana
  if (!formData.username.trim()) {
    errors.username = 'Username is required'
    isValid = false
  } else if (formData.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
    isValid = false
  }

// E-pasta validēšana
  if (!formData.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Please enter a valid email'
    isValid = false
  }

// Paroles validēšana
  if (!formData.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }

// Apstiprināt paroli
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

// Apstiprināt noteikumu pieņemšanu
  if (!formData.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms and conditions'
    isValid = false
  }

// Validēt lomu
  if (!formData.role) {
    errors.role = 'Please select your role'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true

    await authStore.register({
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role
    })

// Veiksmīgas pāradresācijas gadījumā novirzīt uz informācijas paneli
    router.push('/dashboard')
  } catch (error) {
    console.error('Registration error:', error)
  } finally {
    loading.value = false
  }
}
</script>
