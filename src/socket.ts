import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function initSocketIO(server: any) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });

  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    socket.on('send_message', async ({ userId, text }) => {
  if (!text) return;

  // ✅ Save to DB
  const saved = await prisma.liveMessage.create({
    data: { userId, text },
  });

  // ✅ Emit to everyone
  io.emit('receive_message', saved);
});

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });
}