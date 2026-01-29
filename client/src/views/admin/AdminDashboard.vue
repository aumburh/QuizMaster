<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Galvene -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p class="text-gray-600">Manage users, quizzes, and platform settings</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <AppLoading size="lg" />
      </div>

      <!-- Stats Overview -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AppCard padding="md" class="hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Users</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.users.total }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ stats.users.active }} active</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UsersIcon class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </AppCard>

        <AppCard padding="md" class="hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Quizzes</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.quizzes.total }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ stats.quizzes.featured }} featured</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpenIcon class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </AppCard>

        <AppCard padding="md" class="hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Attempts</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.activity.totalAttempts }}</p>
              <p class="text-xs text-gray-500 mt-1">All time</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ActivityIcon class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </AppCard>

        <AppCard padding="md" class="hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">User Roles</p>
              <div class="flex gap-2 mt-1">
                <span class="text-xs font-medium text-blue-600">S: {{ stats.users.students }}</span>
                <span class="text-xs font-medium text-green-600">T: {{ stats.users.teachers }}</span>
                <span class="text-xs font-medium text-red-600">A: {{ stats.users.admins }}</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ShieldIcon class="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            @click="activeTab = 'users'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap',
              activeTab === 'users'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <UsersIcon class="w-4 h-4 inline mr-2" />
            User Management
          </button>
          <button
            @click="activeTab = 'quizzes'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap',
              activeTab === 'quizzes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <BookOpenIcon class="w-4 h-4 inline mr-2" />
            Quiz Management
          </button>
          <button
            @click="activeTab = 'activity'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap',
              activeTab === 'activity'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <ActivityIcon class="w-4 h-4 inline mr-2" />
            Recent Activity
          </button>
        </nav>
      </div>

      <!-- User Management Tab -->
      <div v-if="activeTab === 'users'">
        <AppCard padding="lg">
          <!-- Filters -->
          <div class="mb-6 flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
              <input
                v-model="userSearch"
                type="text"
                placeholder="Search users..."
                class="input w-full"
                @input="debouncedUserSearch"
              />
            </div>
            <select v-model="userRoleFilter" class="input" @change="fetchUsers">
              <option value="">All Roles</option>
              <option value="Student">Students</option>
              <option value="Teacher">Teachers</option>
              <option value="Admin">Admins</option>
            </select>
            <select v-model="userActiveFilter" class="input" @change="fetchUsers">
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <!-- Users Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in users" :key="user._id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span class="text-primary-600 font-semibold">{{ user.username?.[0]?.toUpperCase() }}</span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                        <div class="text-sm text-gray-500">{{ user.name }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <AppBadge :variant="getRoleBadgeVariant(user.role)">{{ user.role }}</AppBadge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <AppBadge :variant="user.isActive ? 'success' : 'error'">
                      {{ user.isActive ? 'Active' : 'Inactive' }}
                    </AppBadge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(user.createdAt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="openEditUserModal(user)"
                      class="text-primary-600 hover:text-primary-900 mr-3"
                      title="Edit user"
                    >
                      <EditIcon class="w-4 h-4 inline" />
                    </button>
                    <button
                      @click="confirmDeleteUser(user)"
                      class="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="user._id === currentUser?.id"
                      title="Delete user"
                    >
                      <TrashIcon class="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="userPagination.pages > 1" class="mt-6 flex justify-center">
            <nav class="flex gap-2">
              <button
                v-for="page in userPagination.pages"
                :key="page"
                @click="changeUserPage(page)"
                :class="[
                  'px-3 py-1 rounded',
                  page === userPagination.page
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                {{ page }}
              </button>
            </nav>
          </div>
        </AppCard>
      </div>

      <!-- Quiz Management Tab -->
      <div v-if="activeTab === 'quizzes'">
        <AppCard padding="lg">
          <!-- Filters -->
          <div class="mb-6 flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
              <input
                v-model="quizSearch"
                type="text"
                placeholder="Search quizzes..."
                class="input w-full"
                @input="debouncedQuizSearch"
              />
            </div>
            <select v-model="quizCategoryFilter" class="input" @change="fetchQuizzes">
              <option value="">All Categories</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="Literature">Literature</option>
              <option value="Technology">Technology</option>
            </select>
            <select v-model="quizDifficultyFilter" class="input" @change="fetchQuizzes">
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <!-- Quizzes Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempts</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="quiz in quizzes" :key="quiz._id" class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">{{ quiz.title }}</div>
                    <div class="text-sm text-gray-500">{{ quiz.questions?.length || 0 }} questions</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ quiz.creator?.username || 'Unknown' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <AppBadge variant="primary">{{ quiz.category }}</AppBadge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <AppBadge :variant="getDifficultyBadgeVariant(quiz.difficulty)">
                      {{ capitalizeFirst(quiz.difficulty) }}
                    </AppBadge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ quiz.totalAttempts || 0 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      @click="toggleFeatured(quiz)"
                      :class="[
                        'px-2 py-1 rounded text-xs font-medium transition-colors',
                        quiz.isFeatured
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      ]"
                    >
                      {{ quiz.isFeatured ? '★ Featured' : '☆ Feature' }}
                    </button>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="viewQuiz(quiz._id)"
                      class="text-blue-600 hover:text-blue-900 mr-3"
                      title="View quiz"
                    >
                      <EyeIcon class="w-4 h-4 inline" />
                    </button>
                    <button
                      @click="confirmDeleteQuiz(quiz)"
                      class="text-red-600 hover:text-red-900"
                      title="Delete quiz"
                    >
                      <TrashIcon class="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="quizPagination.pages > 1" class="mt-6 flex justify-center">
            <nav class="flex gap-2">
              <button
                v-for="page in quizPagination.pages"
                :key="page"
                @click="changeQuizPage(page)"
                :class="[
                  'px-3 py-1 rounded',
                  page === quizPagination.page
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                {{ page }}
              </button>
            </nav>
          </div>
        </AppCard>
      </div>

      <!-- Recent Activity Tab -->
      <div v-if="activeTab === 'activity'">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent Users -->
          <AppCard padding="lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
            <div class="space-y-4">
              <div
                v-for="user in stats.recent.users"
                :key="user._id"
                class="flex items-center justify-between py-3 border-b last:border-b-0"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-primary-600 font-semibold">{{ user.username?.[0]?.toUpperCase() }}</span>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                    <div class="text-xs text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
                <div class="text-right">
                  <AppBadge :variant="getRoleBadgeVariant(user.role)" size="sm">{{ user.role }}</AppBadge>
                  <div class="text-xs text-gray-500 mt-1">{{ formatDate(user.createdAt) }}</div>
                </div>
              </div>
            </div>
          </AppCard>

          <!-- Recent Quizzes -->
          <AppCard padding="lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Quizzes</h3>
            <div class="space-y-4">
              <div
                v-for="quiz in stats.recent.quizzes"
                :key="quiz._id"
                class="flex items-center justify-between py-3 border-b last:border-b-0"
              >
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-900">{{ quiz.title }}</div>
                  <div class="text-xs text-gray-500">by {{ quiz.creator?.username }}</div>
                </div>
                <div class="text-right">
                  <div class="flex gap-2 justify-end mb-1">
                    <AppBadge variant="primary" size="sm">{{ quiz.category }}</AppBadge>
                    <AppBadge :variant="getDifficultyBadgeVariant(quiz.difficulty)" size="sm">
                      {{ capitalizeFirst(quiz.difficulty) }}
                    </AppBadge>
                  </div>
                  <div class="text-xs text-gray-500">{{ formatDate(quiz.createdAt) }}</div>
                </div>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <AppModal
      :show="showEditUserModal"
      @close="showEditUserModal = false"
      title="Edit User"
    >
      <form @submit.prevent="updateUser" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            v-model="editingUser.username"
            type="text"
            class="input w-full bg-gray-50"
            disabled
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            v-model="editingUser.name"
            type="text"
            class="input w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select v-model="editingUser.role" class="input w-full">
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div class="flex items-center">
          <input
            v-model="editingUser.isActive"
            type="checkbox"
            id="isActive"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="isActive" class="ml-2 block text-sm text-gray-700">
            Active Account
          </label>
        </div>
        <div class="flex gap-3 pt-4">
          <AppButton type="button" variant="secondary" @click="showEditUserModal = false" class="flex-1">
            Cancel
          </AppButton>
          <AppButton type="submit" variant="primary" :disabled="updating" class="flex-1">
            <AppLoading v-if="updating" size="sm" class="mr-2" />
            Save Changes
          </AppButton>
        </div>
      </form>
    </AppModal>

    <!-- Delete Confirmation Modal -->
    <AppModal
      :show="showDeleteModal"
      @close="showDeleteModal = false"
      :title="deleteModalTitle"
    >
      <p class="text-gray-700 mb-6">{{ deleteModalMessage }}</p>
      <div class="flex gap-3">
        <AppButton variant="secondary" @click="showDeleteModal = false" class="flex-1">
          Cancel
        </AppButton>
        <AppButton variant="error" @click="confirmDelete" :disabled="deleting" class="flex-1">
          <AppLoading v-if="deleting" size="sm" class="mr-2" />
          Delete
        </AppButton>
      </div>
    </AppModal>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Users as UsersIcon,
  BookOpen as BookOpenIcon,
  Activity as ActivityIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  Eye as EyeIcon,
  Shield as ShieldIcon
} from 'lucide-vue-next'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppLoading from '@/components/common/AppLoading.vue'
import { adminAPI } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const activeTab = ref('users')
const loading = ref(true)
const updating = ref(false)
const deleting = ref(false)

// Stats
const stats = ref({
  users: { total: 0, active: 0, students: 0, teachers: 0, admins: 0 },
  quizzes: { total: 0, featured: 0, public: 0 },
  activity: { totalAttempts: 0 },
  recent: { users: [], quizzes: [] }
})

// Users
const users = ref([])
const userSearch = ref('')
const userRoleFilter = ref('')
const userActiveFilter = ref('')
const userPagination = ref({ page: 1, limit: 10, total: 0, pages: 0 })

// Quizzes
const quizzes = ref([])
const quizSearch = ref('')
const quizCategoryFilter = ref('')
const quizDifficultyFilter = ref('')
const quizPagination = ref({ page: 1, limit: 10, total: 0, pages: 0 })

// Modals
const showEditUserModal = ref(false)
const showDeleteModal = ref(false)
const deleteModalTitle = ref('')
const deleteModalMessage = ref('')
const deleteType = ref('')
const deleteId = ref('')

const editingUser = ref({
  _id: '',
  username: '',
  name: '',
  role: '',
  isActive: true
})

const currentUser = computed(() => authStore.user)

// Fetch platform stats
const fetchStats = async () => {
  try {
    const response = await adminAPI.getStats()
    if (response.data.success) {
      stats.value = response.data.stats
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    notificationStore.error('Error', 'Failed to load statistics')
  }
}

// Fetch users
const fetchUsers = async () => {
  try {
    const params = {
      page: userPagination.value.page,
      limit: userPagination.value.limit
    }

    // Only add filters if they have values
    if (userSearch.value) params.search = userSearch.value
    if (userRoleFilter.value) params.role = userRoleFilter.value
    if (userActiveFilter.value) params.isActive = userActiveFilter.value

    const response = await adminAPI.getAllUsers(params)
    if (response.data.success) {
      users.value = response.data.users
      userPagination.value = response.data.pagination
    }
  } catch (error) {
    console.error('Failed to fetch users:', error)
    notificationStore.error('Error', 'Failed to load users')
  }
}

// Debounced user search
let userSearchTimeout
const debouncedUserSearch = () => {
  clearTimeout(userSearchTimeout)
  userSearchTimeout = setTimeout(() => {
    userPagination.value.page = 1
    fetchUsers()
  }, 300)
}

// Change user page
const changeUserPage = (page) => {
  userPagination.value.page = page
  fetchUsers()
}

// Fetch quizzes
const fetchQuizzes = async () => {
  try {
    const params = {
      page: quizPagination.value.page,
      limit: quizPagination.value.limit
    }

    // Only add filters if they have values
    if (quizSearch.value) params.search = quizSearch.value
    if (quizCategoryFilter.value) params.category = quizCategoryFilter.value
    if (quizDifficultyFilter.value) params.difficulty = quizDifficultyFilter.value

    const response = await adminAPI.getAllQuizzes(params)
    if (response.data.success) {
      quizzes.value = response.data.quizzes
      quizPagination.value = response.data.pagination
    }
  } catch (error) {
    console.error('Failed to fetch quizzes:', error)
    notificationStore.error('Error', 'Failed to load quizzes')
  }
}

// Debounced quiz search
let quizSearchTimeout
const debouncedQuizSearch = () => {
  clearTimeout(quizSearchTimeout)
  quizSearchTimeout = setTimeout(() => {
    quizPagination.value.page = 1
    fetchQuizzes()
  }, 300)
}

// Change quiz page
const changeQuizPage = (page) => {
  quizPagination.value.page = page
  fetchQuizzes()
}

// Open edit user modal
const openEditUserModal = (user) => {
  editingUser.value = {
    _id: user._id,
    username: user.username,
    name: user.name || '',
    role: user.role,
    isActive: user.isActive
  }
  showEditUserModal.value = true
}

// Update user
const updateUser = async () => {
  try {
    updating.value = true
    const response = await adminAPI.updateUser(editingUser.value._id, {
      name: editingUser.value.name,
      role: editingUser.value.role,
      isActive: editingUser.value.isActive
    })

    if (response.data.success) {
      notificationStore.success('Success', 'User updated successfully')
      showEditUserModal.value = false
      await fetchUsers()
      await fetchStats()
    }
  } catch (error) {
    console.error('Failed to update user:', error)
    notificationStore.error('Error', error.response?.data?.message || 'Failed to update user')
  } finally {
    updating.value = false
  }
}

// Confirm delete user
const confirmDeleteUser = (user) => {
  deleteType.value = 'user'
  deleteId.value = user._id
  deleteModalTitle.value = 'Delete User'
  deleteModalMessage.value = `Are you sure you want to delete user "${user.username}"? This action cannot be undone and will also delete all quizzes created by this user.`
  showDeleteModal.value = true
}

// Confirm delete quiz
const confirmDeleteQuiz = (quiz) => {
  deleteType.value = 'quiz'
  deleteId.value = quiz._id
  deleteModalTitle.value = 'Delete Quiz'
  deleteModalMessage.value = `Are you sure you want to delete quiz "${quiz.title}"? This action cannot be undone.`
  showDeleteModal.value = true
}

// Confirm delete
const confirmDelete = async () => {
  try {
    deleting.value = true

    if (deleteType.value === 'user') {
      const response = await adminAPI.deleteUser(deleteId.value)
      if (response.data.success) {
        notificationStore.success('Success', 'User deleted successfully')
        await fetchUsers()
        await fetchStats()
      }
    } else if (deleteType.value === 'quiz') {
      const response = await adminAPI.deleteQuiz(deleteId.value)
      if (response.data.success) {
        notificationStore.success('Success', 'Quiz deleted successfully')
        await fetchQuizzes()
        await fetchStats()
      }
    }

    showDeleteModal.value = false
  } catch (error) {
    console.error('Failed to delete:', error)
    notificationStore.error('Error', error.response?.data?.message || 'Failed to delete')
  } finally {
    deleting.value = false
  }
}

// Toggle featured quiz
const toggleFeatured = async (quiz) => {
  try {
    const response = await adminAPI.toggleFeaturedQuiz(quiz._id)
    if (response.data.success) {
      notificationStore.success('Success', response.data.message)
      await fetchQuizzes()
      await fetchStats()
    }
  } catch (error) {
    console.error('Failed to toggle featured:', error)
    notificationStore.error('Error', 'Failed to update quiz')
  }
}

// View quiz
const viewQuiz = (quizId) => {
  router.push(`/quizzes/${quizId}`)
}

// Helper functions
const getRoleBadgeVariant = (role) => {
  const variants = {
    Admin: 'error',
    Teacher: 'primary',
    Student: 'success'
  }
  return variants[role] || 'default'
}

const getDifficultyBadgeVariant = (difficulty) => {
  const variants = {
    easy: 'success',
    medium: 'warning',
    hard: 'error'
  }
  return variants[difficulty] || 'default'
}

const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Initialize
onMounted(async () => {
  try {
    await Promise.all([fetchStats(), fetchUsers(), fetchQuizzes()])
  } catch (error) {
    console.error('Failed to initialize admin dashboard:', error)
  } finally {
    loading.value = false
  }
})
</script>
