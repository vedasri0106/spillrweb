import express from 'express';
import { reactToPost, getReactions } from '../controllers/reaction.controller';
import  authenticate  from '../middleware/auth';
const router = express.Router();

router.post('/', authenticate, reactToPost);
router.get('/:postId', getReactions);

export default router;