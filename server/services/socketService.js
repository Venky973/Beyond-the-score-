let io = null;

export const initSocket = (serverIo) => {
  io = serverIo;

  io.on('connection', (socket) => {
    // Join match room for real-time live score updates
    socket.on('joinMatch', (matchId) => {
      if (matchId) {
        socket.join(`match:${matchId}`);
      }
    });

    socket.on('leaveMatch', (matchId) => {
      if (matchId) {
        socket.leave(`match:${matchId}`);
      }
    });

    // Join user-specific notification room
    socket.on('joinUser', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });

    socket.on('leaveUser', (userId) => {
      if (userId) {
        socket.leave(`user:${userId}`);
      }
    });

    // General channel for live scoreboards
    socket.on('joinLiveFeed', () => {
      socket.join('liveFeed');
    });

    socket.on('leaveLiveFeed', () => {
      socket.leave('liveFeed');
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};

export const emitScoreUpdate = (matchId, matchData) => {
  if (!io) return;
  io.to(`match:${matchId}`).emit('matchScoreUpdated', matchData);
  io.to('liveFeed').emit('liveFeedUpdated', {
    matchId,
    teamA: matchData.teamA,
    teamB: matchData.teamB,
    matchProgress: matchData.matchProgress,
    status: matchData.status,
    result: matchData.result
  });
};

export const emitMatchEvent = (matchId, eventData) => {
  if (!io) return;
  io.to(`match:${matchId}`).emit('matchEventAdded', eventData);
};

export const emitUserNotification = (userId, notificationData) => {
  if (!io) return;
  io.to(`user:${userId}`).emit('notification', notificationData);
};

export const emitBookingUpdate = (userId, operatorId, bookingData) => {
  if (!io) return;
  if (userId) {
    io.to(`user:${userId}`).emit('bookingStatusChanged', bookingData);
  }
  if (operatorId) {
    io.to(`user:${operatorId}`).emit('operatorBookingUpdated', bookingData);
  }
};
