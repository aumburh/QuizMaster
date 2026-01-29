const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

// Publiski maršruti
router.post('/register', authController.register)
router.post('/login', authController.login)

// Aizsargāti maršruti
router.get('/me', protect, authController.getCurrentUser)
router.put('/profile', protect, authController.updateProfile)

module.exports = router
