import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

export const createComment = async (req: Request, res: Response) => {
  const { postId, text, isAnonymous } = req.body;
  const userId = (req as any).user.userId;
  const comment = await prisma.comment.create({
    data: { postId, text, isAnonymous, userId },
  });
  res.json(comment);
};

export const getComments = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { username: true } } },
  });
  res.json(comments);
};