<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Cookie Preferences</h1>
        <p class="text-gray-600">Manage your cookie and privacy preferences</p>
      </div>

      <!-- Current Status -->
      <AppCard padding="lg" class="mb-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <CookieIcon class="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Cookie Status</h2>
            <p class="text-sm text-gray-600">
              Last updated: {{ consentDate ? formatDate(consentDate) : 'Not set' }}
            </p>
          </div>
        </div>

        <div v-if="!cookieConsentStore.hasConsent" class="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div class="flex gap-3">
            <AlertCircleIcon class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 class="text-sm font-semibold text-amber-900 mb-1">No consent recorded</h3>
              <p class="text-sm text-amber-700">
                You haven't set your cookie preferences yet. Please choose your preferences below.
              </p>
            </div>
          </div>
        </div>
      </AppCard>

      <!-- Cookie Categories -->
      <div class="space-y-4 mb-6">
        <!-- Essential Cookies -->
        <AppCard padding="lg">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <ShieldCheckIcon class="w-5 h-5 text-green-600" />
                <h3 class="text-lg font-semibold text-gray-900">Essential Cookies</h3>
                <AppBadge variant="success" size="sm">Always Active</AppBadge>
              </div>
              <p class="text-sm text-gray-600 mb-3">
                These cookies are necessary for the website to function and cannot be disabled. They are usually
                set in response to actions you take, such as logging in or filling in forms.
              </p>
              <div class="bg-gray-50 rounded-lg p-3 text-xs text-gray-700 space-y-1">
                <p><strong>What we store:</strong></p>
                <ul class="list-disc pl-5 space-y-1">
                  <li>Authentication token (JWT) - keeps you logged in</li>
                  <li>User session data - basic profile information</li>
                  <li>Cookie consent preferences</li>
                </ul>
              </div>
            </div>
            <div class="flex-shrink-0">
              <div class="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1 cursor-not-allowed">
                <div class="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Analytics Cookies -->
        <AppCard padding="lg">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <BarChartIcon class="w-5 h-5 text-primary-600" />
                <h3 class="text-lg font-semibold text-gray-900">Analytics Cookies</h3>
                <AppBadge
                  :variant="preferences.analytics ? 'primary' : 'secondary'"
                  size="sm"
                >
                  {{ preferences.analytics ? 'Enabled' : 'Disabled' }}
                </AppBadge>
              </div>
              <p class="text-sm text-gray-600 mb-3">
                These cookies help us understand how visitors interact with our website by collecting and
                reporting information anonymously. This helps us improve the user experience.
              </p>
              <div class="bg-gray-50 rounded-lg p-3 text-xs text-gray-700 space-y-1">
                <p><strong>What we would track:</strong></p>
                <ul class="list-disc pl-5 space-y-1">
                  <li>Page views and navigation patterns</li>
                  <li>Quiz completion rates and performance</li>
                  <li>Feature usage and interaction times</li>
                </ul>
                <p class="mt-2 text-gray-500 italic">THIS IS ONLY A PROTOTYPE</p>
              </div>
            </div>
            <div class="flex-shrink-0">
              <button
                @click="togglePreference('analytics')"
                :class="[
                  'w-12 h-6 rounded-full flex items-center transition-colors duration-200',
                  preferences.analytics ? 'bg-primary-600 justify-end' : 'bg-gray-300 justify-start'
                ]"
                class="px-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <div class="w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>
          </div>
        </AppCard>

        <!-- Marketing Cookies -->
        <AppCard padding="lg">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <TargetIcon class="w-5 h-5 text-purple-600" />
                <h3 class="text-lg font-semibold text-gray-900">Marketing Cookies</h3>
                <AppBadge
                  :variant="preferences.marketing ? 'primary' : 'secondary'"
                  size="sm"
                >
                  {{ preferences.marketing ? 'Enabled' : 'Disabled' }}
                </AppBadge>
              </div>
              <p class="text-sm text-gray-600 mb-3">
                These cookies are used to track visitors across websites to display relevant advertisements
                and encourage engagement with our content.
              </p>
              <div class="bg-gray-50 rounded-lg p-3 text-xs text-gray-700 space-y-1">
                <p><strong>What we would track:</strong></p>
                <ul class="list-disc pl-5 space-y-1">
                  <li>Advertising campaign effectiveness</li>
                  <li>User interests and preferences</li>
                  <li>Cross-site tracking for personalized ads</li>
                </ul>
                <p class="mt-2 text-gray-500 italic">THIS IS ONLY A PROTOTYPE</p>
              </div>
            </div>
            <div class="flex-shrink-0">
              <button
                @click="togglePreference('marketing')"
                :class="[
                  'w-12 h-6 rounded-full flex items-center transition-colors duration-200',
                  preferences.marketing ? 'bg-primary-600 justify-end' : 'bg-gray-300 justify-start'
                ]"
                class="px-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <div class="w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <AppButton
          variant="primary"
          size="lg"
          @click="savePreferences"
          class="flex-1"
        >
          <SaveIcon class="w-4 h-4 mr-2" />
          Save Preferences
        </AppButton>
        <AppButton
          variant="secondary"
          size="lg"
          @click="acceptAll"
          class="flex-1"
        >
          <CheckIcon class="w-4 h-4 mr-2" />
          Accept All
        </AppButton>
        <AppButton
          variant="outline"
          size="lg"
          @click="resetPreferences"
          class="flex-1"
        >
          <RefreshCwIcon class="w-4 h-4 mr-2" />
          Reset
        </AppButton>
      </div>

      <!-- Additional Information -->
      <AppCard padding="lg">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Additional Information</h3>
        <div class="prose prose-sm max-w-none text-gray-600">
          <p>
            For more information about how we use cookies and protect your privacy, please read our
            <RouterLink to="/privacy-policy" class="text-primary-600 hover:text-primary-700 font-medium">
              Privacy Policy
            </RouterLink>.
          </p>
          <p class="mt-3">
            You can change your preferences at any time by returning to this page. Your consent expires
            after 12 months, after which you'll be asked to confirm your preferences again.
          </p>
          <p class="mt-3">
            <strong>Note:</strong> Disabling cookies may affect your experience on our website. Essential
            cookies cannot be disabled as they are required for the site to function properly, including
            logging in and maintaining your session.
          </p>
        </div>
      </AppCard>

      <!-- Back Button -->
      <div class="mt-8 text-center">
        <AppButton variant="secondary" @click="router.back()">
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          Go Back
        </AppButton>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import {
  Cookie as CookieIcon,
  ShieldCheck as ShieldCheckIcon,
  BarChart as BarChartIcon,
  Target as TargetIcon,
  AlertCircle as AlertCircleIcon,
  Save as SaveIcon,
  Check as CheckIcon,
  RefreshCw as RefreshCwIcon,
  ArrowLeft as ArrowLeftIcon
} from 'lucide-vue-next'
import { useCookieConsentStore } from './consent.js'
import { useNotificationStore } from 'quizmaster-client/src/stores/notification'
import AppLayout from 'quizmaster-client/src/components/layout/AppLayout.vue'
import AppCard from 'quizmaster-client/src/components/common/AppCard.vue'
import AppBadge from 'quizmaster-client/src/components/common/AppBadge.vue'
import AppButton from 'quizmaster-client/src/components/common/AppButton.vue'

const router = useRouter()
const cookieConsentStore = useCookieConsentStore()
const notificationStore = useNotificationStore()

const preferences = ref({
  essential: true,
  analytics: false,
  marketing: false
})

const consentDate = computed(() => cookieConsentStore.consentDate)

onMounted(() => {
  // Load current preferences
  preferences.value = { ...cookieConsentStore.preferences }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const togglePreference = (key) => {
  if (key !== 'essential') {
    preferences.value[key] = !preferences.value[key]
  }
}

const savePreferences = () => {
  cookieConsentStore.setConsent(preferences.value)
  notificationStore.success('Your cookie preferences have been saved')
}

const acceptAll = () => {
  preferences.value = {
    essential: true,
    analytics: true,
    marketing: true
  }
  cookieConsentStore.setConsent(preferences.value)
  notificationStore.success('All cookies have been accepted')
}

const resetPreferences = () => {
  preferences.value = {
    essential: true,
    analytics: false,
    marketing: false
  }
  notificationStore.info('Preferences reset to defaults (not saved yet)')
}
</script>

