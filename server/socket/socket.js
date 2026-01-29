const socketio = require('socket.io');

module.exports = (server) => {
  const io = socketio(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Saglabā sesiju stāvokli atmiņā
  const sessions = {};

  // Palīgs, kas izveido vieglu sesiju pārskatu administrācijai un lietotāja saskarnei
  function buildSessionsSummary() {
    return Object.entries(sessions).map(([id, s]) => ({
      sessionId: id,
      name: s.name,
      quizId: s.quizId,
      maxPlayers: s.maxPlayers,
      playerCount: (s.players && s.players.length) || 0,
      started: !!s.started,
      createdAt: s.createdAt || null
    }));
  }

  // Izsūta pašreizējo aktīvo sesiju sarakstu visiem pieslēgtajiem klientiem
  function broadcastActiveSessions() {
    io.emit('activeSessions', buildSessionsSummary());
  }

  io.on('connection', (socket) => {
    // Izveidot sesiju (izsaucējam jānosūta vienkāršs objekts, piem. ar toRaw Vue)
    socket.on('createSession', (sessionData) => {
      if (!sessionData || typeof sessionData !== 'object') return;

      // Ģenerē vieglu unikālu ID
      const sessionId = 's_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

      // Normalizē un saglabā minimālu sesijas informāciju
      sessions[sessionId] = {
        name: sessionData.name || 'Untitled Session',
        quizId: sessionData.quizId || null,
        maxPlayers: sessionData.maxPlayers || 0,
        players: [],
        started: false,
        createdAt: new Date().toISOString()
      };

      // Atbild izveidotājam ar piešķirto ID un sesijas datiem
      socket.emit('sessionCreated', { sessionId, session: sessions[sessionId] });

      // Izsūta atjauninājumu par aktīvajām sesijām
      broadcastActiveSessions();
    });

    // Pievienoties viktorīnas sesijai
    socket.on('joinSession', ({ sessionId, userId, username }) => {
      socket.join(sessionId);
      if (!sessions[sessionId]) sessions[sessionId] = { players: [] };
      if (!sessions[sessionId].players.find(p => p.userId === userId)) {
        sessions[sessionId].players.push({ userId, username, score: 0, streak: 0, eliminated: false });
      }
      io.to(sessionId).emit('sessionUpdate', sessions[sessionId]);
      broadcastActiveSessions();
    });

    // Iesniegt atbildi
    socket.on('submitAnswer', ({ sessionId, userId, questionIndex, selected, timeTaken }) => {
      const session = sessions[sessionId];
      if (!session) return;
      if (!session.answers) session.answers = [];
      if (!session.answers[questionIndex]) session.answers[questionIndex] = [];
      session.answers[questionIndex].push({ userId, selected, timeTaken });
      io.to(sessionId).emit('answerUpdate', { questionIndex, userId, selected });
    });

    // Sākt sesiju
    socket.on('startSession', ({ sessionId }) => {
      if (sessions[sessionId]) sessions[sessionId].started = true;
      io.to(sessionId).emit('sessionStarted', { sessionId });
      broadcastActiveSessions();
    });

    // Beigt sesiju
    socket.on('endSession', ({ sessionId }) => {
      io.to(sessionId).emit('sessionEnded', { sessionId });
      delete sessions[sessionId];
      broadcastActiveSessions();
    });

    // Atstāt sesiju
    socket.on('leaveSession', ({ sessionId, userId }) => {
      socket.leave(sessionId);
      if (sessions[sessionId]) {
        sessions[sessionId].players = sessions[sessionId].players.filter(p => p.userId !== userId);
        io.to(sessionId).emit('sessionUpdate', sessions[sessionId]);
      }
      broadcastActiveSessions();
    });

    // Atļaut administrācijai vai lietotāja saskarnei pieprasīt aktīvās sesijas pie pieslēgšanās
    socket.on('getActiveSessions', () => {
      socket.emit('activeSessions', buildSessionsSummary());
    });

    // Noņemt lietotāju no sesijām atvienošanās brīdī un izsūtīt atjauninājumus
    socket.on('disconnect', () => {
      // Noņemt šī socket lietotāju no sesijām, ja tiek izsekots socket->user mapping
      // Vienkāršākai demonstrācijai: pārsūtīt pašreizējās sesijas, lai administrācija būtu sinhronizēta
      broadcastActiveSessions();
    });
  });
};
