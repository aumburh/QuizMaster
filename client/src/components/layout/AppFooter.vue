<template>
  <footer class="bg-gray-900 text-gray-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span class="text-xl font-bold text-white">QuizMaster</span>
          </div>
          <p class="text-sm text-gray-400 max-w-md">
            An online quiz and learning platform designed to help students learn,
            compete, and track their progress.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-white font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <RouterLink to="/quizzes" class="hover:text-white transition-colors">
                Browse Quizzes
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/leaderboard" class="hover:text-white transition-colors">
                Leaderboard
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/multiplayer" class="hover:text-white transition-colors">
                Multiplayer
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/faq" class="hover:text-white transition-colors">
                FAQ
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="text-white font-semibold mb-4">Legal</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <RouterLink to="/privacy-policy" class="hover:text-white transition-colors">
                Privacy Policy
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/terms-and-conditions" class="hover:text-white transition-colors">
                Terms & Conditions
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/contact" class="hover:text-white transition-colors">
                Contact Us
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} QuizMaster. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>
