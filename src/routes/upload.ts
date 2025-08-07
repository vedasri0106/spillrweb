// src/routes/upload.ts
import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/'),
  filename: (_req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ Example POST route for file upload
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  res.status(200).json({
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});

export default router;