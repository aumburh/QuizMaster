const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Visiem administratora maršrutiem ir nepieciešama autentifikācija un administratora loma
router.use(protect);
router.use(restrictTo('Admin'));

// Administratora paneļa statistika
router.get('/stats', adminController.getStats);

// Lietotāju pārvaldība
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId', adminController.updateUser);
router.delete('/users/:userId', adminController.deleteUser);

// Viktorīnu pārvaldība
router.get('/quizzes', adminController.getAllQuizzes);
router.put('/quizzes/:quizId/featured', adminController.toggleFeaturedQuiz);
router.delete('/quizzes/:quizId', adminController.deleteQuiz);

module.exports = router;
