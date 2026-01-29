const Quiz = require('../models/Quiz');

// Atmiņā glabātas multiplayer sesijas
const sessions = new Map();

// Izveido multiplayer sesiju
const createSession = async (req, res) => {
  try {
    const { quizId, maxPlayers = 4 } = req.body;

    // Pārbauda, vai viktorīna eksistē
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Ģenerē sesijas ID
    const sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();

    const session = {
      id: sessionId,
      quizId,
      quiz: quiz.title,
      host: req.user.id,
      players: [{
        id: req.user.id,
        username: req.user.username,
        isHost: true,
        ready: false
      }],
      maxPlayers,
      status: 'waiting', // waiting, active, finished
      createdAt: new Date()
    };

    sessions.set(sessionId, session);

    res.status(201).json({
      message: 'Multiplayer session created',
      sessionId,
      session
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating session', error: error.message });
  }
};

// Pievienoties multiplayer sesijai
const joinSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status !== 'waiting') {
      return res.status(400).json({ message: 'Session is not accepting new players' });
    }

    if (session.players.length >= session.maxPlayers) {
      return res.status(400).json({ message: 'Session is full' });
    }

    // Pārbauda, vai lietotājs jau nav sesijā
    const existingPlayer = session.players.find(p => p.id === req.user.id);
    if (existingPlayer) {
      return res.status(400).json({ message: 'You are already in this session' });
    }

    // Pievieno spēlētāju sesijai
    session.players.push({
      id: req.user.id,
      username: req.user.username,
      isHost: false,
      ready: false
    });

    sessions.set(sessionId, session);

    res.json({
      message: 'Joined session successfully',
      session
    });
  } catch (error) {
    res.status(500).json({ message: 'Error joining session', error: error.message });
  }
};

// Sākt multiplayer sesiju
const startSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Tikai izveidotājs var sākt sesiju
    if (session.host !== req.user.id) {
      return res.status(403).json({ message: 'Only the host can start the session' });
    }

    if (session.status !== 'waiting') {
      return res.status(400).json({ message: 'Session already started or finished' });
    }

    // Atjaunina sesijas statusu
    session.status = 'active';
    session.startedAt = new Date();

    sessions.set(sessionId, session);

    res.json({
      message: 'Session started',
      session
    });
  } catch (error) {
    res.status(500).json({ message: 'Error starting session', error: error.message });
  }
};

// Saņemt sesijas detaļas
const getSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = sessions.get(id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching session', error: error.message });
  }
};

// Atstāt sesiju
const leaveSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Noņem spēlētāju no sesijas
    session.players = session.players.filter(p => p.id !== req.user.id);

    // Ja izveidotājs atstāj, piešķir jaunu izveidotāju vai dzēšs sesiju
    if (session.host === req.user.id) {
      if (session.players.length > 0) {
        session.host = session.players[0].id;
        session.players[0].isHost = true;
      } else {
        sessions.delete(sessionId);
        return res.json({ message: 'Left session and session deleted' });
      }
    }

    sessions.set(sessionId, session);

    res.json({
      message: 'Left session successfully',
      session
    });
  } catch (error) {
    res.status(500).json({ message: 'Error leaving session', error: error.message });
  }
};

// Saņemt visas gaidošās sesijas
const getBattles = async (req, res) => {
  try {
    // Pārveido sessions Map uz masīvu un filtrē tikai gaidošās sesijas
    const battles = Array.from(sessions.values())
      .filter(session => session.status === 'waiting')
      .map(session => ({
        id: session.id,
        quiz: session.quiz,
        players: session.players.length,
        maxPlayers: session.maxPlayers,
        host: session.players.find(p => p.isHost)?.username,
        createdAt: session.createdAt
      }));

    res.json(battles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching battles', error: error.message });
  }
};

// Izveidot battle
const createBattle = async (req, res) => {
  // Pārizmanto createSession loģiku, ja nav quizId, izlases viktorīna tiek izvēlēta
  try {
    let { quizId, maxPlayers = 4 } = req.body;

    // Ja nav quizId, izvēlas nejaušu viktorīnu
    if (!quizId) {
      const randomQuiz = await Quiz.aggregate([{ $sample: { size: 1 } }]);
      if (randomQuiz.length === 0) {
        return res.status(404).json({ message: 'No quizzes available for battle' });
      }
      quizId = randomQuiz[0]._id;
    }

    // Izmanto createSession loģiku
    req.body.quizId = quizId;
    return createSession(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error creating battle', error: error.message });
  }
};

// Pievienoties battle pēc ID
const joinBattle = async (req, res) => {
  try {
    const { battleId } = req.params;
    req.body.sessionId = battleId;
    return joinSession(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error joining battle', error: error.message });
  }
};

module.exports = {
  createSession,
  joinSession,
  startSession,
  getSession,
  leaveSession,
  getBattles,
  createBattle,
  joinBattle
};
