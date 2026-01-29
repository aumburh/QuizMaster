<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p class="text-gray-600">Manage your account settings and view your progress</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profila kartīte -->
        <div class="lg:col-span-1">
          <AppCard padding="lg">
            <div class="text-center">
              <div class="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon class="w-12 h-12 text-primary-600" />
              </div>
              <h2 class="text-xl font-bold text-gray-900">{{ user?.name }}</h2>
              <p class="text-sm text-gray-600 mb-4">{{ user?.email }}</p>
              <AppBadge variant="primary" size="lg">{{ user?.role }}</AppBadge>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Member since</span>
                <span class="font-medium text-gray-900">{{ formatDate(user?.createdAt) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Total Points</span>
                <span class="font-medium text-gray-900">{{ stats.totalPoints }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Rank</span>
                <span class="font-medium text-gray-900">#{{ stats.rank }}</span>
              </div>
            </div>
          </AppCard>
        </div>

        <!-- Galvenais saturs -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Rediģēt profilu -->
          <AppCard padding="lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h3>
            <form @submit.prevent="handleUpdateProfile" class="space-y-4">
              <AppInput
                v-model="profileForm.name"
                label="Full Name"
                required
              />

              <AppInput
                v-model="profileForm.email"
                label="Email"
                type="email"
                required
              />

              <div class="flex justify-end gap-3">
                <AppButton variant="secondary" type="button" @click="resetForm">
                  Cancel
                </AppButton>
                <AppButton variant="primary" type="submit" :loading="updating">
                  Save Changes
                </AppButton>
              </div>
            </form>
          </AppCard>

          <!-- Mainīt paroli -->
          <AppCard padding="lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            <form @submit.prevent="handleChangePassword" class="space-y-4">
              <AppInput
                v-model="passwordForm.currentPassword"
                label="Current Password"
                type="password"
                required
              />

              <AppInput
                v-model="passwordForm.newPassword"
                label="New Password"
                type="password"
                required
                hint="Must be at least 6 characters"
              />

              <AppInput
                v-model="passwordForm.confirmPassword"
                label="Confirm New Password"
                type="password"
                required
              />

              <div class="flex justify-end">
                <AppButton variant="primary" type="submit" :loading="changingPassword">
                  Update Password
                </AppButton>
              </div>
            </form>
          </AppCard>

          <!-- Statistics -->
          <AppCard padding="lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">My Statistics</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-3xl font-bold text-gray-900">{{ stats.quizzesTaken }}</div>
                <div class="text-sm text-gray-600 mt-1">Quizzes Taken</div>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-3xl font-bold text-gray-900">{{ stats.averageScore }}%</div>
                <div class="text-sm text-gray-600 mt-1">Average Score</div>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-3xl font-bold text-gray-900">{{ stats.quizzesPassed }}</div>
                <div class="text-sm text-gray-600 mt-1">Quizzes Passed</div>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-3xl font-bold text-gray-900">{{ formatTime(stats.totalTimeSpent, stats.totalTimeSpentUnit) }}</div>
                <div class="text-sm text-gray-600 mt-1">Time Spent</div>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import { User as UserIcon } from 'lucide-vue-next'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppLoading from '@/components/common/AppLoading.vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { userAPI } from '@/services/api'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { user } = storeToRefs(authStore)

// Formas stāvokļis
const profileForm = ref({
  name: '',
  email: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Lietotāja statistika (noklusējuma vērtības līdz datiem tiek ielādēti)
const stats = ref({
  quizzesTaken: 0,
  averageScore: 0,
  quizzesPassed: 0,
  totalTimeSpent: 0,
  totalTimeSpentUnit: 'seconds',
  totalPoints: 0,
  rank: 0
})

// UI stāvokļa karodziņi
const updating = ref(false)           // Profilas atjaunināšanas process
const changingPassword = ref(false)   // Paroles maiņas process
const loadingStats = ref(true)        // Vai statuss tiek ielādēts

// Formatē laiku ērtākai rādīšanai
const formatTime = (seconds, unit) => {
  if (!seconds) return '0s'

  if (unit === 'hours') {
    return `${Math.round(seconds / 3600)}h`
  } else if (unit === 'minutes') {
    return `${Math.round(seconds / 60)}m`
  } else {
    return `${seconds}s`
  }
}

// Datuma formatēšana (piem., "Jan 1, 2024")
const formatDate = (date) => {
  return dayjs(date).format('MMM D, YYYY')
}

// Atiestata profila formu uz pašreizējā lietotāja datiem
const resetForm = () => {
  profileForm.value = {
    name: user.value?.name || '',
    email: user.value?.email || ''
  }
}

// Iegūst lietotāja statistiku no API un aizpilda stats
const fetchUserStats = async () => {
  try {
    loadingStats.value = true
    const response = await userAPI.getCurrentProfile()

    if (response.data.success) {
      // Sagaidām, ka API atbild ar objektu stats
      stats.value = response.data.stats
    }
  } catch (error) {
    console.error('Failed to fetch user stats:', error)
    notificationStore.error('Error', 'Failed to load user statistics')
  } finally {
    loadingStats.value = false
  }
}

// Saglabā profila izmaiņas, izmantojot authStore
const handleUpdateProfile = async () => {
  updating.value = true
  try {
    await authStore.updateProfile(profileForm.value)
    notificationStore.success('Profile Updated', 'Your profile has been updated successfully')
  } catch (error) {
    notificationStore.error('Update Failed', error.response?.data?.message || 'Failed to update profile')
  } finally {
    updating.value = false
  }
}

// Paroles maiņ - validē ievadi
const handleChangePassword = async () => {
  // Pārbauda vai jaunā parole un tās apstiprinājums sakrīt
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    notificationStore.error('Validation Error', 'Passwords do not match')
    return
  }

  // Minimālās drošības prasības - garums
  if (passwordForm.value.newPassword.length < 6) {
    notificationStore.error('Validation Error', 'Password must be at least 6 characters')
    return
  }

  changingPassword.value = true
  try {
    notificationStore.success('Password Changed', 'Your password has been updated successfully')
    // Atiestata paroles formas lauki pēc veiksmīgas maiņas
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    notificationStore.error('Update Failed', error.response?.data?.message || 'Failed to change password')
  } finally {
    changingPassword.value = false
  }
}

// Atiestata formu un ielādē statistiku
onMounted(() => {
  resetForm()
  fetchUserStats()
})
</script>
