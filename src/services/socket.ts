import { Server as HttpServer } from 'http';  
import { Server as SocketIOServer } from 'socket.io';

export const setUpSocketIO = (server: HttpServer): void => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',  // Replace with your frontend URL in production
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('sendMessage', (message) => {
        console.log(message);
      io.to(message.receiverId).emit('message', message);
    });

    socket.on('joinGroup', (groupId) => {
      socket.join(groupId);
    });

    socket.on('sendGroupMessage', (message) => {
      io.to(message.groupId).emit('groupMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
