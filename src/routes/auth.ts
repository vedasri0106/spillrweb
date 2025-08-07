import express from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authenticate from '../middleware/auth';
import { Request } from 'express'
interface CustomRequest extends Request {
  user?: {
    id: string
    username?: string
    email?: string
  }
}
const router = express.Router();

// ✅ GET /api/auth/me - Fetch logged-in user's full profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        isAnonymous: true,
        createdAt: true,
        bio: true,
        profilePic: true, // ✅ Ensure these are returned
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('❌ Error in /me:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ POST /api/auth/login - Email/password login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password)
      return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (err: any) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ GET /api/auth/user - Fetch posts of the logged-in user
router.get('/user', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (err) {
    console.error('❌ Error in /user posts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// 📄 src/routes/auth.ts

// ✅ GET all users (except self)
// ✅ Public user list (temporary)
router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      profilePic: true,
    },
  });
  res.json(users);
});



export default router;