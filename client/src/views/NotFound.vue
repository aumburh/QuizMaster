<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="text-center">
      <div class="mb-8">
        <div class="text-9xl font-bold text-gray-200">404</div>
        <SearchXIcon class="w-24 h-24 text-gray-400 mx-auto -mt-12" />
      </div>

      <h1 class="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div class="flex items-center justify-center gap-4">
        <AppButton variant="secondary" @click="router.back()">
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          Go Back
        </AppButton>
        <RouterLink to="/">
          <AppButton variant="primary">
            <HomeIcon class="w-4 h-4 mr-2" />
            Go Home
          </AppButton>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { SearchX as SearchXIcon, ArrowLeft as ArrowLeftIcon, Home as HomeIcon } from 'lucide-vue-next'
import AppButton from '@/components/common/AppButton.vue'

const router = useRouter()
</script>
