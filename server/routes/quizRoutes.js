const express = require('express')
const router = express.Router()
const quizController = require('../controllers/quizController')
const { protect } = require('../middleware/authMiddleware')

// Publiskie maršruti
router.get('/', quizController.getAllQuizzes || ((req, res) => {
  res.json({ success: true, quizzes: [], message: 'Get all quizzes' })
}))

router.get('/featured', quizController.getFeaturedQuizzes || ((req, res) => {
  res.json({ success: true, message: 'Get featured quizzes' })
}))

router.get('/categories', quizController.getCategories || ((req, res) => {
  res.json({ success: true, message: 'Get quiz categories' })
}))

router.get('/:id', quizController.getQuizById || ((req, res) => {
  res.json({ success: true, message: 'Get quiz by ID' })
}))

// Aizsargātie maršruti
router.use(protect)
router.get('/user/my-quizzes', quizController.getUserQuizzes || ((req, res) => {
  res.json({ success: true, message: 'Get user quizzes' })
}))

router.post('/', quizController.createQuiz || ((req, res) => {
  res.json({ success: true, message: 'Create quiz' })
}))

router.put('/:id', quizController.updateQuiz || ((req, res) => {
  res.json({ success: true, message: 'Update quiz' })
}))

router.delete('/:id', quizController.deleteQuiz || ((req, res) => {
  res.json({ success: true, message: 'Delete quiz' })
}))

router.post('/:id/submit', quizController.submitQuiz || ((req, res) => {
  res.json({ success: true, message: 'Submit quiz' })
}))

router.get('/:quizId/results', quizController.getQuizResults || ((req, res) => {
  res.json({ success: true, message: 'Get quiz results' })
}))

router.get('/:quizId/results/:resultId', quizController.getResult || ((req, res) => {
  res.json({ success: true, message: 'Get result' })
}))

router.post('/:quizId/results/:resultId/grade', quizController.gradeResult || ((req, res) => {
  res.json({ success: true, message: 'Grade result' })
}))

module.exports = router
