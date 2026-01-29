const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

// Visām lietotāja maršrutēm nepieciešama autentifikācija
router.use(protect)

// Saņemt pašreizējā lietotāja profilu
router.get('/profile', userController.getUserProfile || ((req, res) => {
  res.json({ success: true })
}))

// Saņemt lietotāja rezultātus
router.get('/results', userController.getUserResults || ((req, res) => {
  res.json({ success: true, results: [], message: 'Get user results - to be implemented' })
}))

// Saņemt rezultātu tabulu
router.get('/leaderboard', userController.getLeaderboard || ((req, res) => {
  res.json({ success: true, leaderboard: [], message: 'Get leaderboard - to be implemented' })
}))

// Saņemt konkrēta lietotāja profilu pēc ID
router.get('/:id', userController.getUserProfile || ((req, res) => {
  res.json({ success: true, message: 'Get user profile by ID - to be implemented' })
}))

module.exports = router
