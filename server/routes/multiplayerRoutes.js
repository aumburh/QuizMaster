const express = require('express');
const router = express.Router();
const {
  createSession,
  joinSession,
  startSession,
  getSession,
  leaveSession,
  getBattles,
  createBattle,
  joinBattle
} = require('../controllers/multiplayerController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Publiski maršruti — ikviens var skatīt aktīvās kaujas
router.get('/battles', getBattles);

// Aizsargāti maršruti
router.post('/battles', authMiddleware, createBattle);
router.post('/battles/:battleId/join', authMiddleware, joinBattle);

// Sesijas maršruti
router.post('/create', authMiddleware, createSession);
router.post('/join', authMiddleware, joinSession);
router.post('/start', authMiddleware, startSession);
router.post('/leave', authMiddleware, leaveSession);
router.get('/:id', authMiddleware, getSession);

module.exports = router;
