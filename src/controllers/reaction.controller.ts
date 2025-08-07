import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const reactToPost = async (req: Request, res: Response) => {
  const { emoji, postId } = req.body;
  const userId = (req as any).user.userId;

  const existing = await prisma.reaction.findFirst({ where: { postId, userId, emoji } });
  if (existing) return res.status(200).json(existing);

  const reaction = await prisma.reaction.create({
    data: { postId, userId, emoji },
  });

  res.json(reaction);
};

export const getReactions = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const reactions = await prisma.reaction.findMany({
    where: { postId },
  });
  res.json(reactions);
};