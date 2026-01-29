<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p class="text-gray-600">Last updated: {{ lastUpdated }}</p>
      </div>

      <!-- Content -->
      <div class="prose prose-lg max-w-none">
        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p class="text-gray-700 mb-4">
            Welcome to QuizMaster. We respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you about how we look after your personal data when you visit our
            platform and tell you about your privacy rights and how the law protects you.
          </p>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
          <p class="text-gray-700 mb-4">
            <strong>2.1 Personal Information:</strong> We collect information that you provide directly to us:
          </p>
          <ul class="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Account Information:</strong> Name, username, email address, password</li>
            <li><strong>Profile Information:</strong> Avatar, bio, preferences</li>
            <li><strong>User Content:</strong> Quizzes created, answers submitted, comments</li>
            <li><strong>Communication Data:</strong> Messages sent through our contact forms</li>
          </ul>
          <p class="text-gray-700 mt-4">
            <strong>2.2 Automatically Collected Information:</strong>
          </p>
          <ul class="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Usage Data:</strong> Pages visited, quizzes taken, time spent on platform</li>
            <li><strong>Device Information:</strong> Browser type, IP address, operating system</li>
            <li><strong>Performance Data:</strong> Quiz scores, completion rates, learning statistics</li>
            <li><strong>Cookies:</strong> Authentication tokens, preferences, analytics</li>
          </ul>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
          <p class="text-gray-700 mb-4">We use your information for the following purposes:</p>
          <ul class="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Service Provision:</strong> To provide and maintain our Service</li>
            <li><strong>Account Management:</strong> To manage your account and authentication</li>
            <li><strong>Personalization:</strong> To customize your experience and show relevant content</li>
            <li><strong>Communication:</strong> To send you updates, notifications, and support messages</li>
            <li><strong>Analytics:</strong> To understand how users interact with our Service</li>
            <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security incidents</li>
            <li><strong>Legal Compliance:</strong> To comply with legal obligations</li>
            <li><strong>Improvement:</strong> To improve and develop new features</li>
          </ul>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
          <p class="text-gray-700 mb-4">
            <strong>4.1 Public Information:</strong> Certain information is public by default:
          </p>
          <ul class="list-disc pl-6 text-gray-700 space-y-2">
            <li>Username and display name</li>
            <li>Public quizzes you create</li>
            <li>Leaderboard rankings (if you participate)</li>
            <li>Public profile information you choose to share</li>
          </ul>
          <p class="text-gray-700 mt-4">
            <strong>4.2 We Do Not Sell Your Data:</strong> We do not sell, rent, or trade your personal
            information to third parties.
          </p>
          <p class="text-gray-700 mt-4">
            <strong>4.3 Limited Sharing:</strong> We may share your information only in these circumstances:
          </p>
          <ul class="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>With Your Consent:</strong> When you explicitly agree to sharing</li>
            <li><strong>Service Providers:</strong> With trusted partners who help us operate the Service</li>
            <li><strong>Legal Requirements:</strong> When required by law or legal process</li>
            <li><strong>Safety:</strong> To protect the rights and safety of QuizMaster and our users</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
          </ul>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
          <p class="text-gray-700 mb-4">
            We implement appropriate technical and organizational measures to protect your personal data:
          </p>
          <ul class="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Encryption:</strong> Data is encrypted in transit using HTTPS/TLS</li>
            <li><strong>Password Security:</strong> Passwords are hashed using industry-standard algorithms</li>
            <li><strong>Access Controls:</strong> Limited access to personal data on a need-to-know basis</li>
            <li><strong>Regular Audits:</strong> Security practices are regularly reviewed and updated</li>
            <li><strong>Secure Infrastructure:</strong> Data is stored on secure servers with backups</li>
          </ul>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
          <p class="text-gray-700 mb-4">
            We retain your personal data only for as long as necessary to fulfill the purposes outlined in
            this privacy policy:
          </p>
          <ul class="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Active Accounts:</strong> Data is retained while your account is active</li>
            <li><strong>Deleted Accounts:</strong> Most data is deleted within 30 days of account deletion</li>
            <li><strong>Legal Requirements:</strong> Some data may be retained longer for legal compliance</li>
            <li><strong>Anonymized Data:</strong> Aggregated, anonymized data may be retained indefinitely</li>
          </ul>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
          <p class="text-gray-700 mb-4">You have the following rights regarding your personal data:</p>
          <ul class="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your account and personal data</li>
            <li><strong>Portability:</strong> Request your data in a portable format</li>
            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
            <li><strong>Objection:</strong> Object to certain types of data processing</li>
          </ul>
          <p class="text-gray-700 mt-4">
            To exercise these rights, please contact us at
            <a href="mailto:privacy@quizmaster.com" class="text-primary-600 hover:text-primary-700 font-medium">
              privacy@quizmaster.com
            </a>
          </p>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking</h2>
          <p class="text-gray-700 mb-4">
            We use cookies and similar tracking technologies to:
          </p>
          <ul class="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for authentication and basic functionality</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            <li><strong>Analytics Cookies:</strong> Understand how users interact with our Service</li>
          </ul>
          <p class="text-gray-700 mt-4">
            You can control cookies through your browser settings. Note that disabling cookies may affect
            functionality.
          </p>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
          <p class="text-gray-700 mb-4">
            Our Service is not intended for children under 13 years of age. We do not knowingly collect
            personal information from children under 13. If you are a parent or guardian and believe your
            child has provided us with personal information, please contact us.
          </p>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
          <p class="text-gray-700 mb-4">
            Your information may be transferred to and maintained on servers located outside of your state,
            province, country, or other governmental jurisdiction where data protection laws may differ.
            We ensure appropriate safeguards are in place for such transfers.
          </p>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Policy</h2>
          <p class="text-gray-700 mb-4">
            We may update this privacy policy from time to time. We will notify you of any changes by:
          </p>
          <ul class="list-disc pl-6 text-gray-700 space-y-2">
            <li>Posting the new policy on this page</li>
            <li>Updating the "Last updated" date</li>
            <li>Sending an email notification for material changes</li>
          </ul>
        </AppCard>

        <AppCard padding="lg" class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
          <p class="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <p class="text-gray-700">
              <strong>Email:</strong> privacy@quizmaster.com
            </p>
            <p class="text-gray-700">
              <strong>Data Protection Officer:</strong> dpo@quizmaster.com
            </p>
            <p class="text-gray-700">
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

