// 📄 src/routes/post.ts
import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { prisma } from '../lib/prisma'; // ✅ Make sure this exists
import { Post } from '@prisma/client'; // optional
import authenticate from '../middleware/auth'; // ✅ Import your auth middleware
const router = express.Router();

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/'),
  filename: (_req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ Extend Request type to include optional user (if using auth later)
interface CustomRequest extends Request {
  user?: { id: string };
}
router.get('/', async (_req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// ✅ Route handler

router.post('/create', authenticate, upload.single('media'), async (req: CustomRequest, res) => {
  try {
    const userId = req.user?.id;
    const { content, isAnonymous } = req.body;
    const media = req.file ? `/uploads/${req.file.filename}` : null;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const post = await prisma.post.create({
      data: {
        content,
        mediaUrl: media,
        isAnonymous: JSON.parse(isAnonymous),
        userId,
      },
    });

    res.status(201).json(post);
  } catch (err) {
    console.error('❌ Error creating post:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});


// 👤 Get posts by logged-in user
// 👤 Get posts by logged-in user

// ✅ src/routes/post.ts
router.get('/user', authenticate, async (req, res) => {
  const userId = (req as any).user.id;

  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(posts);
  } catch (err) {
    console.error('❌ Failed to get user posts:', err);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});
// ✅ DELETE a post
router.delete('/:id', authenticate, async (req: CustomRequest, res) => {
  const userId = req.user?.id;
  const postId = req.params.id;

  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post || post.userId !== userId) {
    return res.status(403).json({ error: 'Unauthorized or Post not found' });
  }

  await prisma.post.delete({ where: { id: postId } });
  res.json({ message: 'Post deleted' });
});

// ✅ EDIT/UPDATE a post (text only for now)
router.put('/:id', authenticate, async (req: CustomRequest, res) => {
  const userId = req.user?.id;
  const postId = req.params.id;
  const { content } = req.body;

  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post || post.userId !== userId) {
    return res.status(403).json({ error: 'Unauthorized or Post not found' });
  }

  const updated = await prisma.post.update({
    where: { id: postId },
    data: { content },
  });

  res.json(updated);
});
export default router;