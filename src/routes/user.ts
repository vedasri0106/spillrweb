import express from 'express';
import multer from 'multer';
import path from 'path';
import authenticate from '../middleware/auth';
import { prisma } from '../lib/prisma';

const router = express.Router();

// 📦 Multer setup for profile image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/'),
  filename: (_req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// 👤 PUT /api/user/edit
router.put('/edit', authenticate, upload.single('profilePic'), async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { username, bio } = req.body;
    const profilePic = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        bio,
        ...(profilePic && { profilePic }),
      },
    });

    res.json({
      message: 'Profile updated',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        bio: updatedUser.bio,
        profilePic: updatedUser.profilePic,
      },
    });
  } catch (err) {
    console.error('❌ Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;