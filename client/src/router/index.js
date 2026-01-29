import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/quizzes',
    name: 'Quizzes',
    component: () => import('@/views/quiz/QuizList.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/quizzes/create',
    name: 'QuizCreate',
    component: () => import('@/views/quiz/QuizCreate.vue'),
    meta: { requiresAuth: true, requiresRole: ['Teacher', 'Admin'] }
  },
  {
    path: '/quizzes/:quizId/results',
    name: 'QuizResults',
    component: () => import('@/views/quiz/QuizResults.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/quizzes/:id',
    name: 'QuizDetail',
    component: () => import('@/views/quiz/QuizDetail.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/quizzes/:id/take',
    name: 'QuizTake',
    component: () => import('@/views/quiz/QuizTake.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/quizzes/:id/edit',
    name: 'QuizEdit',
    component: () => import('@/views/quiz/QuizEdit.vue'),
    meta: { requiresAuth: true, requiresRole: ['Teacher', 'Admin'] }
  },
  {
    path: '/multiplayer',
    name: 'Multiplayer',
    component: () => import('@/views/multiplayer/MultiplayerLobby.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/multiplayer/:sessionId',
    name: 'MultiplayerGame',
    component: () => import('@/views/multiplayer/MultiplayerGame.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: () => import('@/views/Leaderboard.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/user/Profile.vue'),
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/contact',
  //   name: 'Contact',
  //   component: () => import('../../../archive/Contact.vue'),
  //   meta: { requiresAuth: false }
  // },
  // {
  //   path: '/faq',
  //   name: 'FAQ',
  //   component: () => import('../../../archive/FAQ.vue'),
  //   meta: { requiresAuth: false }
  // },
  // {
  //   path: '/terms-and-conditions',
  //   name: 'TermsAndConditions',
  //   component: () => import('../../../archive/legal/TermsAndConditions.vue'),
  //   meta: { requiresAuth: false }
  // },
  // {
  //   path: '/privacy-policy',
  //   name: 'PrivacyPolicy',
  //   component: () => import('../../../archive/legal/PrivacyPolicy.vue'),
  //   meta: { requiresAuth: false }
  // },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, requiresRole: ['admin'] }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigācijas sargi
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const requiresRole = to.meta.requiresRole

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (requiresGuest && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
  } else if (requiresRole && authStore.user) {
// Pārbauda, vai lietotāja loma atbilst kādai no nepieciešamajām lomām (reģistrnejutīgs)
    const hasRequiredRole = requiresRole.some(role =>
      role.toLowerCase() === authStore.user.role.toLowerCase()
    )

    if (hasRequiredRole) {
      next()
    } else {
      console.log('Access denied: User role', authStore.user.role, 'not in', requiresRole)
      next({ name: 'Dashboard' })
    }
  } else {
    next()
  }
})

export default router
