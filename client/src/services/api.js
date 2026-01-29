import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Pievienot pieprasījumu marķieri, ja pieejams
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Apstrādāt atbildes kļūdas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Autentifikācijas galapunkti
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
}

// Viktorīnas galapunkti
export const quizAPI = {
  getQuizzes: (params) => api.get('/quizzes', { params }),
  getQuiz: (id) => api.get(`/quizzes/${id}`),
  getFeaturedQuizzes: () => api.get('/quizzes/featured'),
  getCategories: () => api.get('/quizzes/categories'),
  getUserQuizzes: () => api.get('/quizzes/user/my-quizzes'),
  createQuiz: (data) => api.post('/quizzes', data),
  updateQuiz: (id, data) => api.put(`/quizzes/${id}`, data),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
  submitQuiz: (id, data) => api.post(`/quizzes/${id}/submit`, data),
  getQuizResults: (quizId) => api.get(`/quizzes/${quizId}/results`),
  getResult: (quizId, resultId) => api.get(`/quizzes/${quizId}/results/${resultId}`),
  gradeResult: (quizId, resultId, data) => api.post(`/quizzes/${quizId}/results/${resultId}/grade`, data)
}

// Lietotāja galapunkti
export const userAPI = {
  getProfile: (id) => api.get(`/user/${id}`),
  getCurrentProfile: () => api.get('/user/profile'),
  getResults: () => api.get('/user/results'),
  getLeaderboard: (params) => api.get('/user/leaderboard', { params })
}

// Administratora galapunkti
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getAllQuizzes: (params) => api.get('/admin/quizzes', { params }),
  toggleFeaturedQuiz: (quizId) => api.put(`/admin/quizzes/${quizId}/featured`),
  deleteQuiz: (quizId) => api.delete(`/admin/quizzes/${quizId}`)
}

export default api
