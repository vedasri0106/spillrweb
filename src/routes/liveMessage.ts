import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// ✅ GET /api/live - fetch all live messages
router.get('/', async (_req, res) => {
  try {
    const messages = await prisma.liveMessage.findMany({
      orderBy: { createdAt: 'asc' },
    });
    res.json(messages);
  } catch (err) {
    console.error('❌ Failed to fetch live messages:', err);
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

export default router;
