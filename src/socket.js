import { Server } from 'socket.io';

let io;

export const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    socket.on('join:user', (userId) => {
      if (userId) socket.join(`user:${userId}`);
    });
  });
};

export const emitUploadNotification = ({ userId, file, message }) => {
  if (!io) return;
  io.to(`user:${userId}`).emit('upload:notification', {
    userId,
    file,
    message
  });
};
