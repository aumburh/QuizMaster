<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Contact Form -->
        <div class="lg:col-span-2">
          <AppCard padding="lg">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Name -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AppInput
                  v-model="formData.firstName"
                  label="First Name"
                  placeholder="John"
                  required
                  :error="errors.firstName"
                />
                <AppInput
                  v-model="formData.lastName"
                  label="Last Name"
                  placeholder="Doe"
                  required
                  :error="errors.lastName"
                />
              </div>

              <!-- Email -->
              <AppInput
                v-model="formData.email"
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                required
                :error="errors.email"
              />

              <!-- Subject -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Subject
                </label>
                <select
                  v-model="formData.subject"
                  class="input w-full"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="bug">Report a Bug</option>
                  <option value="feature">Feature Request</option>
                  <option value="account">Account Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="privacy">Privacy Concern</option>
                  <option value="other">Other</option>
                </select>
                <p v-if="errors.subject" class="mt-1 text-sm text-red-600">{{ errors.subject }}</p>
              </div>

              <!-- Message -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Message
                </label>
                <textarea
                  v-model="formData.message"
                  class="input w-full h-40 resize-none"
                  placeholder="Tell us more about your inquiry..."
                  required
                ></textarea>
                <p v-if="errors.message" class="mt-1 text-sm text-red-600">{{ errors.message }}</p>
              </div>

              <!-- Submit Button -->
              <AppButton
                type="submit"
                variant="primary"
                size="lg"
                :disabled="submitting"
                class="w-full"
              >
                <SendIcon v-if="!submitting" class="w-4 h-4 mr-2" />
                <AppLoading v-if="submitting" size="sm" class="mr-2" />
                {{ submitting ? 'Sending...' : 'Send Message' }}
              </AppButton>

              <!-- Success Message -->
              <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="flex items-start">
                  <CheckCircleIcon class="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                  <div>
                    <h3 class="text-sm font-medium text-green-800">Message Sent!</h3>
                    <p class="text-sm text-green-700 mt-1">{{ successMessage }}</p>
                  </div>
                </div>
              </div>
            </form>
          </AppCard>
        </div>

        <!-- Contact Information -->
        <div class="space-y-6">
          <!-- Quick Contact -->
          <AppCard padding="lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Contact</h3>
            <div class="space-y-4">
              <div class="flex items-start">
                <MailIcon class="w-5 h-5 text-primary-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p class="text-sm font-medium text-gray-900">Email</p>
                  <a href="mailto:support@quizmaster.com" class="text-sm text-primary-600 hover:text-primary-700">
                    support@quizmaster.com
                  </a>
                </div>
              </div>

              <div class="flex items-start">
                <PhoneIcon class="w-5 h-5 text-primary-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p class="text-sm font-medium text-gray-900">Phone</p>
                  <p class="text-sm text-gray-600">+1 (555) 123-4567</p>
                  <p class="text-xs text-gray-500 mt-1">Mon-Fri, 9am-5pm EST</p>
                </div>
              </div>

              <div class="flex items-start">
                <MapPinIcon class="w-5 h-5 text-primary-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p class="text-sm font-medium text-gray-900">Address</p>
                  <p class="text-sm text-gray-600">
                    123 Education Street<br>
                    Learning City, LC 12345<br>
                    United States
                  </p>
                </div>
              </div>
            </div>
          </AppCard>

          <!-- FAQ Link -->
          <AppCard padding="lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p class="text-sm text-gray-600 mb-4">
              Check out our frequently asked questions for quick answers to common questions.
            </p>
            <RouterLink to="/faq">
              <AppButton variant="secondary" size="sm" class="w-full">
                <HelpCircleIcon class="w-4 h-4 mr-2" />
                Visit FAQ
              </AppButton>
            </RouterLink>
          </AppCard>

          <!-- Social Media -->
          <AppCard padding="lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
            <div class="flex space-x-3">
              <a href="#" class="w-10 h-10 bg-gray-100 hover:bg-primary-100 rounded-lg flex items-center justify-center transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-100 hover:bg-primary-100 rounded-lg flex items-center justify-center transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-100 hover:bg-primary-100 rounded-lg flex items-center justify-center transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z"/>
                </svg>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-100 hover:bg-primary-100 rounded-lg flex items-center justify-center transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
  Send as SendIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  HelpCircle as HelpCircleIcon,
  CheckCircle as CheckCircleIcon
} from 'lucide-vue-next'
import AppLayout from 'quizmaster-client/src/components/layout/AppLayout.vue'
import AppCard from 'quizmaster-client/src/components/common/AppCard.vue'
import AppInput from 'quizmaster-client/src/components/common/AppInput.vue'
import AppButton from 'quizmaster-client/src/components/common/AppButton.vue'
import AppLoading from 'quizmaster-client/src/components/common/AppLoading.vue'
import { useNotificationStore } from 'quizmaster-client/src/stores/notification'
import { RouterLink } from 'vue-router'

const notificationStore = useNotificationStore()

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: ''
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: ''
})

const submitting = ref(false)
const successMessage = ref('')

const validateForm = () => {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')

  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Please enter a valid email'
    isValid = false
  }

  if (!formData.subject) {
    errors.subject = 'Please select a subject'
    isValid = false
  }

  if (!formData.message.trim()) {
    errors.message = 'Message is required'
    isValid = false
  } else if (formData.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  successMessage.value = ''

  if (!validateForm()) {
    return
  }

  submitting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // In a real app, you would send this to your backend
    console.log('Contact form submitted:', formData)

    successMessage.value = 'Thank you for contacting us! We\'ll get back to you within 24-48 hours.'
    notificationStore.success('Message Sent!', 'We\'ll respond to your inquiry as soon as possible.')

    // Reset form
    Object.keys(formData).forEach(key => formData[key] = '')
  } catch (error) {
    notificationStore.error('Failed to Send', 'Please try again or email us directly.')
  } finally {
    submitting.value = false
  }
}
</script>
