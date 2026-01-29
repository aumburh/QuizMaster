<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
        <p class="text-gray-600">Last updated: {{ lastUpdated }}</p>
      </div>

      <!-- Content -->
      <div class="prose prose-lg max-w-none">
        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p class="text-gray-700 mb-4">
            By accessing and using QuizMaster ("the Service"), you accept and agree to be bound by the terms and
            provisions of this agreement. If you do not agree to these terms, please do not use the Service.
          </p>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
          <p class="text-gray-700 mb-4">
            QuizMaster provides an online platform for creating, sharing, and taking quizzes. The Service allows:
          </p>
          <ul class="list-disc pl-6 text-gray-700 space-y-2">
            <li>Students to take quizzes and track their learning progress</li>
            <li>Teachers to create and manage educational quizzes</li>
            <li>Users to participate in multiplayer quiz sessions</li>
            <li>Access to leaderboards and performance statistics</li>
          </ul>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
          <p class="text-gray-700 mb-4">
            <strong>3.1 Registration:</strong> You must register for an account to access certain features.
            You agree to provide accurate, current, and complete information during registration.
          </p>
          <p class="text-gray-700 mb-4">
            <strong>3.2 Account Security:</strong> You are responsible for maintaining the confidentiality of
            your account credentials and for all activities that occur under your account.
          </p>
          <p class="text-gray-700 mb-4">
            <strong>3.3 Account Types:</strong> We offer different account types (Student, Teacher, Admin)
            with varying levels of access and functionality.
          </p>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">4. User Content</h2>
          <p class="text-gray-700 mb-4">
            <strong>4.1 Responsibility:</strong> You are solely responsible for any content you create,
            upload, or share through the Service, including quiz questions, answers, and explanations.
          </p>
          <p class="text-gray-700 mb-4">
            <strong>4.2 Content Standards:</strong> You agree not to post content that is:
          </p>
          <ul class="list-disc pl-6 text-gray-700 space-y-2">
            <li>Illegal, harmful, threatening, abusive, or discriminatory</li>
            <li>Infringes on intellectual property rights</li>
            <li>Contains viruses or malicious code</li>
            <li>Violates the privacy of others</li>
            <li>Misleading or fraudulent</li>
          </ul>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">5. Acceptable Use</h2>
          <p class="text-gray-700 mb-4">You agree not to:</p>
          <ul class="list-disc pl-6 text-gray-700 space-y-2">
            <li>Use the Service for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Use automated systems to access the Service without permission</li>
            <li>Impersonate any person or entity</li>
            <li>Harass, abuse, or harm other users</li>
          </ul>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
          <p class="text-gray-700 mb-4">
            The Service and its original content, features, and functionality are owned by QuizMaster and are
            protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">7. Privacy</h2>
          <p class="text-gray-700 mb-4">
            Your use of the Service is also governed by our Privacy Policy. Please review our
            <RouterLink to="/privacy-policy" class="text-primary-600 hover:text-primary-700 font-medium">
              Privacy Policy
            </RouterLink>
            to understand our practices.
          </p>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
          <p class="text-gray-700 mb-4">
            We may terminate or suspend your account and access to the Service immediately, without prior
            notice or liability, for any reason, including breach of these Terms.
          </p>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
          <p class="text-gray-700 mb-4">
            If you have any questions about these Terms, please contact us:
          </p>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-gray-700">
              <strong>Email:</strong> legal@quizmaster.com<br>
              <RouterLink to="/contact" class="text-primary-600 hover:text-primary-700 font-medium">
                Contact Form
              </RouterLink>
            </p>
          </div>
        </AppCard>
      </div>

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
import { useRouter } from 'vue-router'
import { ArrowLeft as ArrowLeftIcon } from 'lucide-vue-next'
import AppLayout from 'quizmaster-client/src/components/layout/AppLayout.vue'
import AppCard from 'quizmaster-client/src/components/common/AppCard.vue'
import AppButton from 'quizmaster-client/src/components/common/AppButton.vue'

const router = useRouter()
const lastUpdated = 'October 15, 2025'
</script>

