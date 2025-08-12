import { Router } from "express";
import feedbackController from '../controllers/feedbackController.js';

const router = Router();

router.get('/', feedbackController.fetchAllFeedback);

export default router;