import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ Create Post Controller
export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, isPublic, isAnonymous = false } = req.body;

    const newPost = await prisma.post.create({
      data: {
        content,
        isPublic,
        isAnonymous, // ✅ required by your Prisma schema
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// ✅ Get All Posts Controller
export const getAllPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};