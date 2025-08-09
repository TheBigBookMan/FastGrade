import { Router } from 'express';
import commentController from '../controllers/commentController.js';

const router = Router();

router.get('/:userId', commentController.fetchCommentsByUserId);
router.post('/:userId', commentController.postComment);

export default router;