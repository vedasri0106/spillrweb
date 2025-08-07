import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import postRoutes from './routes/post';
import uploadRoutes from './routes/upload';
import commentRoutes from './routes/comment';
import reactionRoutes from './routes/reaction';
import userRoutes from './routes/user';
import messageRoutes from './routes/message';
import dmRoutes from './routes/dm';
import liveMessageRoutes from './routes/liveMessage';
import { createServer } from 'http';
import { initSocketIO } from './socket'; // ✅ central socket logic

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const httpServer = createServer(app);

// ✅ Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ✅ Routes
app.get('/', (_req, res) => res.send('Welcome to ConfessionWeb Backend'));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/reactions', reactionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/dm', dmRoutes);
app.use('/api/live', liveMessageRoutes); // ✅ Live message API

// ✅ Start socket server
initSocketIO(httpServer);

// ✅ Start HTTP + WS server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running at http://localhost:${PORT}`);
});