<template>
  <Transition name="slide-up">
    <div
      v-if="showBanner"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <!-- Cookie Icon and Message -->
          <div class="flex items-start gap-3 flex-1">
            <div class="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <CookieIcon class="w-6 h-6 text-primary-600" />
            </div>
            <div class="flex-1">
              <h3 class="text-base font-semibold text-gray-900 mb-1">
                We value your privacy
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                We use essential cookies to ensure our site functions properly and to keep you logged in.
                These are necessary for the service to work.
                <button
                  @click="showDetails = !showDetails"
                  class="text-primary-600 hover:text-primary-700 font-medium ml-1 underline"
                >
                  {{ showDetails ? 'Show less' : 'Learn more' }}
                </button>
              </p>

              <!-- Expandable Details -->
              <Transition name="expand">
                <div v-if="showDetails" class="mt-3 text-sm text-gray-600 space-y-2">
                  <div class="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div>
                      <span class="font-semibold text-gray-900">Essential Cookies:</span>
                      <span class="ml-1">Authentication tokens and session data required for login functionality.</span>
                    </div>
                    <div>
                      <span class="font-semibold text-gray-900">What we store:</span>
                      <span class="ml-1">Your login token and basic user information in browser local storage.</span>
                    </div>
                  </div>
                  <p>
                    For more information, read our
                    <RouterLink to="/privacy-policy" class="text-primary-600 hover:text-primary-700 font-medium underline">
                      Privacy Policy
                    </RouterLink>
                  </p>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <AppButton
              variant="secondary"
              size="sm"
              @click="acceptEssential"
              class="w-full sm:w-auto whitespace-nowrap"
            >
              Accept Essential
            </AppButton>
            <AppButton
              variant="primary"
              size="sm"
              @click="acceptAll"
              class="w-full sm:w-auto whitespace-nowrap"
            >
              Accept All
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Cookie as CookieIcon } from 'lucide-vue-next'
import { useCookieConsentStore } from 'archive/consent'
import AppButton from 'quizmaster-client/src/components/common/AppButton.vue'

const cookieConsentStore = useCookieConsentStore()
const showBanner = ref(false)
const showDetails = ref(false)

onMounted(() => {
  // Show banner if user hasn't made a choice yet
  if (!cookieConsentStore.hasConsent) {
    // Small delay for better UX
    setTimeout(() => {
      showBanner.value = true
    }, 1000)
  }
})

const acceptEssential = () => {
  cookieConsentStore.setConsent({
    essential: true,
    analytics: false,
    marketing: false
  })
  showBanner.value = false
}

const acceptAll = () => {
  cookieConsentStore.setConsent({
    essential: true,
    analytics: true,
    marketing: true
  })
  showBanner.value = false
}
</script>

<style scoped>
/* Slide up animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Expand animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>

