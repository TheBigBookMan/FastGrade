import { Router } from "express";
import feedbackController from '../controllers/feedbackController.js';

const router = Router();

router.get('/', feedbackController.fetchAllFeedback);
router.post('/', feedbackController.createFeedback);

export default router;