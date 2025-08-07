import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function initSocketIO(server: HTTPServer) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });

  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // ✅ Global Live Chat
    socket.on('send_message', async ({ userId, text }) => {
      // Save to DB
      await prisma.liveMessage.create({
        data: { userId, text },
      });

      io.emit('receive_message', { userId, text });
    });

    // ✅ Private DM rooms
    socket.on('join_private_room', ({ roomId }) => {
      socket.join(roomId);
    });

    socket.on('send_private_message', ({ roomId, message, sender }) => {
      io.to(roomId).emit('receive_private_message', { message, sender });
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });
}