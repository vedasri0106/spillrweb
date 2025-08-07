import express from 'express';
import { createComment, getComments } from '../controllers/comment.controller';
import  authenticate  from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, createComment);
router.get('/:postId', getComments);

export default router;