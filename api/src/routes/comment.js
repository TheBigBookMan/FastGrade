import { Router } from 'express';
import commentController from '../controllers/commentController.js';

const router = Router();

router.get('/:userId', commentController.fetchCommentsByUserId);
router.get('/:commentId/user/:userId', commentController.fetchCommentByUserId);
router.post('/', commentController.postComment);

export default router;