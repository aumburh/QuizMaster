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
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <RouterLink to="/register" class="font-medium text-primary-600 hover:text-primary-500">
            create a new account
          </RouterLink>
        </p>
      </div>

      <!-- Pieteikšanās forma -->
      <AppCard padding="lg">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Pieteikšanās forma -->
          <AppInput
            v-model="formData.email"
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            required
            :error="errors.email"
          />

          <!-- Paroles lauks -->
          <AppInput
            v-model="formData.password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            :error="errors.password"
          />

          <!-- Atcerēties mani un aizmirstu paroli -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="formData.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              >
              <label for="remember" class="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div class="text-sm">
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <!-- Iesniegšanas poga -->
          <AppButton
            type="submit"
            variant="primary"
            size="lg"
            :disabled="loading"
            class="w-full"
          >
            <AppLoading v-if="loading" size="sm" class="mr-2" />
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </AppButton>
        </form>
        <div class="mt-4 text-center">
          <router-link to="/" class="text-sm text-primary-600 hover:text-primary-500 underline-offset-2">
            Go back to home
          </router-link>
        </div>
      </AppCard>
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
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: ''
})

const loading = ref(false)

const validateForm = () => {
  let isValid = true

// Atiestatīt kļūdas
  Object.keys(errors).forEach(key => errors[key] = '')

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
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true

    await authStore.login({
      email: formData.email,
      password: formData.password
    })

// Veiksmīgas pāradresācijas gadījumā novirzīt uz informācijas paneli
    router.push('/dashboard')
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
</script>
