import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCookieConsentStore = defineStore('cookieConsent', () => {
  const CONSENT_KEY = 'cookie-consent'
  const CONSENT_DATE_KEY = 'cookie-consent-date'

  // Cookie preferences
  const preferences = ref({
    essential: true, // Always true, required for functionality
    analytics: false,
    marketing: false
  })

  const consentGiven = ref(false)
  const consentDate = ref(null)

  // Computed
  const hasConsent = computed(() => consentGiven.value)
  const canUseAnalytics = computed(() => preferences.value.analytics)
  const canUseMarketing = computed(() => preferences.value.marketing)

  // Initialize from localStorage
  const initConsent = () => {
    try {
      const storedConsent = localStorage.getItem(CONSENT_KEY)
      const storedDate = localStorage.getItem(CONSENT_DATE_KEY)

      if (storedConsent) {
        const parsed = JSON.parse(storedConsent)
        preferences.value = {
          essential: true, // Always true
          analytics: parsed.analytics || false,
          marketing: parsed.marketing || false
        }
        consentGiven.value = true
        consentDate.value = storedDate ? new Date(storedDate) : null

        // Check if consent is older than 1 year (re-consent required)
        if (consentDate.value) {
          const oneYearAgo = new Date()
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

          if (consentDate.value < oneYearAgo) {
            // Consent expired, reset
            resetConsent()
          }
        }
      }
    } catch (e) {
      console.error('Failed to load cookie consent:', e)
    }
  }

  // Set consent preferences
  const setConsent = (newPreferences) => {
    preferences.value = {
      essential: true, // Always true
      analytics: newPreferences.analytics || false,
      marketing: newPreferences.marketing || false
    }
    consentGiven.value = true
    consentDate.value = new Date()

    // Save to localStorage
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(preferences.value))
      localStorage.setItem(CONSENT_DATE_KEY, consentDate.value.toISOString())
    } catch (e) {
      console.error('Failed to save cookie consent:', e)
    }
  }

  // Reset consent (for testing or re-consent)
  const resetConsent = () => {
    preferences.value = {
      essential: true,
      analytics: false,
      marketing: false
    }
    consentGiven.value = false
    consentDate.value = null

    try {
      localStorage.removeItem(CONSENT_KEY)
      localStorage.removeItem(CONSENT_DATE_KEY)
    } catch (e) {
      console.error('Failed to reset cookie consent:', e)
    }
  }

  // Update specific preference
  const updatePreference = (key, value) => {
    if (key !== 'essential') { // Essential can't be disabled
      preferences.value[key] = value
      setConsent(preferences.value)
    }
  }

  return {
    preferences,
    consentGiven,
    consentDate,
    hasConsent,
    canUseAnalytics,
    canUseMarketing,
    initConsent,
    setConsent,
    resetConsent,
    updatePreference
  }
})

