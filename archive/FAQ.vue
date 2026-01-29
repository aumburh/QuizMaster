<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about QuizMaster. Can't find what you're looking for?
          <RouterLink to="/contact" class="text-primary-600 hover:text-primary-700 font-medium">
            Contact us
          </RouterLink>
        </p>
      </div>

      <!-- Search -->
      <div class="mb-8">
        <div class="relative">
          <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search FAQs..."
            class="input w-full pl-10"
          />
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="mb-8 border-b border-gray-200">
        <nav class="flex space-x-8 overflow-x-auto" aria-label="FAQ Categories">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="selectedCategory = cat.id"
            :class="[
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              selectedCategory === cat.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ cat.name }}
          </button>
        </nav>
      </div>

      <!-- FAQ Items -->
      <div class="space-y-4">
        <div v-if="filteredFaqs.length === 0" class="text-center py-12">
          <SearchXIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p class="text-gray-600">Try adjusting your search or browse all categories</p>
        </div>

        <AppCard
          v-for="(faq, index) in filteredFaqs"
          :key="index"
          padding="lg"
          class="transition-all duration-200 hover:shadow-md cursor-pointer"
          @click="toggleFaq(index)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2 pr-8">
                {{ faq.question }}
              </h3>
              <transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-96"
                leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="opacity-100 max-h-96"
                leave-to-class="opacity-0 max-h-0"
              >
                <div v-if="openFaqIndex === index" class="text-gray-700 space-y-2 overflow-hidden">
                  <p v-html="faq.answer"></p>
                </div>
              </transition>
            </div>
            <button class="flex-shrink-0 text-gray-400 hover:text-gray-600">
              <ChevronDownIcon
                :class="[
                  'w-5 h-5 transition-transform duration-200',
                  openFaqIndex === index ? 'rotate-180' : ''
                ]"
              />
            </button>
          </div>
        </AppCard>
      </div>

      <!-- Still Need Help -->
      <div class="mt-12">
        <AppCard padding="lg" class="bg-primary-50 border-primary-200">
          <div class="text-center">
            <HelpCircleIcon class="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Still need help?</h3>
            <p class="text-gray-700 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div class="flex justify-center gap-4">
              <RouterLink to="/contact">
                <AppButton variant="primary">
                  <MessageCircleIcon class="w-4 h-4 mr-2" />
                  Contact Support
                </AppButton>
              </RouterLink>
              <a href="mailto:support@quizmaster.com">
                <AppButton variant="secondary">
                  <MailIcon class="w-4 h-4 mr-2" />
                  Email Us
                </AppButton>
              </a>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Search as SearchIcon,
  SearchX as SearchXIcon,
  ChevronDown as ChevronDownIcon,
  HelpCircle as HelpCircleIcon,
  MessageCircle as MessageCircleIcon,
  Mail as MailIcon
} from 'lucide-vue-next'
import AppLayout from 'quizmaster-client/src/components/layout/AppLayout.vue'
import AppCard from 'quizmaster-client/src/components/common/AppCard.vue'
import AppButton from 'quizmaster-client/src/components/common/AppButton.vue'

const searchQuery = ref('')
const selectedCategory = ref('all')
const openFaqIndex = ref(null)

const categories = [
  { id: 'all', name: 'All Questions' },
  { id: 'getting-started', name: 'Getting Started' },
  { id: 'account', name: 'Account & Profile' },
  { id: 'quizzes', name: 'Quizzes' },
  { id: 'teachers', name: 'For Teachers' },
  { id: 'technical', name: 'Technical' }
]

const faqs = [
  // Getting Started
  {
    category: 'getting-started',
    question: 'What is QuizMaster?',
    answer: 'QuizMaster is an online learning platform that allows students to take quizzes and teachers to create and manage educational content. It features interactive quizzes, real-time multiplayer modes, leaderboards, and comprehensive progress tracking.'
  },
  {
    category: 'getting-started',
    question: 'How do I sign up?',
    answer: 'Click the "Register" button in the top right corner, choose whether you\'re a Student or Teacher, fill in your details, and you\'re ready to go! Registration is free and takes less than a minute.'
  },
  {
    category: 'getting-started',
    question: 'Is QuizMaster free to use?',
    answer: 'Yes! QuizMaster offers a free tier with access to all basic features including taking quizzes, creating quizzes, and participating in multiplayer games. Premium features may be added in the future.'
  },
  {
    category: 'getting-started',
    question: 'What\'s the difference between Student and Teacher accounts?',
    answer: 'Students can take quizzes, track their progress, and compete on leaderboards. Teachers have all student features plus the ability to create, edit, and manage quizzes. You can choose your role during registration.'
  },

  // Account & Profile
  {
    category: 'account',
    question: 'How do I change my password?',
    answer: 'Go to your Profile page, click on "Account Settings," and select "Change Password." You\'ll need to enter your current password and then your new password twice to confirm.'
  },
  {
    category: 'account',
    question: 'Can I change my role from Student to Teacher?',
    answer: 'Currently, role changes need to be requested through our support team. <a href="/contact" class="text-primary-600 hover:text-primary-700">Contact us</a> with your request and we\'ll update your account within 24 hours.'
  },
  {
    category: 'account',
    question: 'How do I delete my account?',
    answer: 'We\'re sorry to see you go! You can delete your account from the Profile page under "Account Settings." Please note that this action is permanent and cannot be undone. All your data will be removed within 30 days.'
  },
  {
    category: 'account',
    question: 'Why can\'t I see my quiz history?',
    answer: 'Make sure you\'re logged in to the same account you used to take the quizzes. Your quiz history is available on your Dashboard and Profile pages. If you still can\'t see it, try clearing your browser cache or contact support.'
  },

  // Quizzes
  {
    category: 'quizzes',
    question: 'How do I take a quiz?',
    answer: 'Browse available quizzes from the "Quizzes" page, click on a quiz that interests you, review the details, and click "Start Quiz." Answer all questions and submit when you\'re done to see your results!'
  },
  {
    category: 'quizzes',
    question: 'Can I pause a quiz and resume later?',
    answer: 'Currently, quizzes must be completed in one session. However, we\'re working on adding a save-and-resume feature. Until then, make sure you have enough time before starting a quiz.'
  },
  {
    category: 'quizzes',
    question: 'How is my score calculated?',
    answer: 'Your score is based on the number of correct answers and the point value assigned to each question. Most questions are worth 1 point, but teachers can assign different point values. Your percentage score is calculated as (points earned / total points) × 100.'
  },
  {
    category: 'quizzes',
    question: 'Can I retake a quiz?',
    answer: 'Yes! You can retake quizzes as many times as you\'d like. Each attempt is recorded separately so you can track your improvement over time.'
  },
  {
    category: 'quizzes',
    question: 'What types of questions are supported?',
    answer: 'QuizMaster supports multiple question types including Multiple Choice, True/False, and Short Answer questions. Teachers can mix different question types in a single quiz.'
  },

  // For Teachers
  {
    category: 'teachers',
    question: 'How do I create a quiz?',
    answer: 'Click "Create Quiz" from your Dashboard. Fill in the quiz details (title, description, category, difficulty), add your questions, and click "Create Quiz." You can add multiple choice, true/false, or open-ended questions.'
  },
  {
    category: 'teachers',
    question: 'Can I edit a quiz after publishing?',
    answer: 'Yes! Go to "My Quizzes" from your Dashboard, find the quiz you want to edit, and click the edit icon. You can modify questions, answers, and settings at any time.'
  },
  {
    category: 'teachers',
    question: 'How do I make my quiz public or private?',
    answer: 'When creating or editing a quiz, you\'ll see a "Public Quiz" toggle. Public quizzes appear in the browse list for all users. Private quizzes can only be accessed by you or via a direct link.'
  },
  {
    category: 'teachers',
    question: 'Can I see who took my quiz?',
    answer: 'Yes! Go to your quiz\'s detail page and click on "Results" or "Statistics" to see all attempts, including usernames, scores, and completion times. This helps you track student performance.'
  },
  {
    category: 'teachers',
    question: 'How do I set a time limit for my quiz?',
    answer: 'When creating or editing a quiz, you\'ll find a "Time Limit" field where you can set the duration in minutes. Set it to 0 for no time limit. Students will see a countdown timer during the quiz.'
  },
  {
    category: 'teachers',
    question: 'Can I import questions from a file?',
    answer: 'This feature is coming soon! Currently, questions need to be entered manually through the quiz creation interface. We\'re working on CSV and Excel import functionality.'
  },

  // Technical
  {
    category: 'technical',
    question: 'What browsers are supported?',
    answer: 'QuizMaster works best on the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience and security.'
  },
  {
    category: 'technical',
    question: 'Is there a mobile app?',
    answer: 'Currently, QuizMaster is a web application that works on mobile browsers. We\'re planning native iOS and Android apps in the future. The website is fully responsive and works great on phones and tablets.'
  },
  {
    category: 'technical',
    question: 'Why am I having trouble logging in?',
    answer: 'Make sure you\'re using the correct email and password. If you forgot your password, click "Forgot Password" on the login page. Also check that cookies are enabled in your browser. If problems persist, <a href="/contact" class="text-primary-600 hover:text-primary-700">contact support</a>.'
  },
  {
    category: 'technical',
    question: 'The page won\'t load. What should I do?',
    answer: 'Try these steps: 1) Refresh the page (Ctrl+R or Cmd+R), 2) Clear your browser cache and cookies, 3) Try a different browser, 4) Check your internet connection, 5) Disable browser extensions temporarily. If none of these work, <a href="/contact" class="text-primary-600 hover:text-primary-700">let us know</a>.'
  },
  {
    category: 'technical',
    question: 'Is my data secure?',
    answer: 'Yes! We take security seriously. All data is encrypted in transit using HTTPS/TLS, passwords are hashed using industry-standard algorithms, and we never sell your personal information. Read our <a href="/privacy-policy" class="text-primary-600 hover:text-primary-700">Privacy Policy</a> for details.'
  },
  {
    category: 'technical',
    question: 'Can I use QuizMaster offline?',
    answer: 'No, QuizMaster requires an internet connection to function. All quizzes and data are stored on our secure servers to ensure synchronization across devices and prevent data loss.'
  }
]

const filteredFaqs = computed(() => {
  let filtered = faqs

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(faq => faq.category === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    )
  }

  return filtered
})

const toggleFaq = (index) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}
</script>

