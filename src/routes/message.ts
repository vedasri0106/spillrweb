// routes/messageRoutes.ts
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import authenticate from '../middleware/auth';

const prisma = new PrismaClient();
const router = express.Router();

interface CustomRequest extends Request {
  user?: { id: string };
}

router.get('/:userId', authenticate, async (req: CustomRequest, res: Response) => {
  const fromUserId = req.user?.id; // decoded from JWT
  const toUserId = req.params.userId;

  if (!fromUserId) {
    return res.status(401).json({ error: 'Unauthorized' }); // ⛔️ This is returned if token invalid
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    },
    orderBy: { createdAt: 'asc' },
  });

  return res.json(messages); // ✅ Always return an array
});

export default router;