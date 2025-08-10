import { Router } from "express";
import rubricController from '../controllers/rubricController.js';

const router = Router();

router.get('/:userId', rubricController.fetchRubricsByUserId);
router.post('/:userId', rubricController.postRubric);

export default router;