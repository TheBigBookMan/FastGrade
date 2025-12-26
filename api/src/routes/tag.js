import { Router } from "express";
import tagController from '../controllers/tagController.js';

const router = Router();

router.get('/:userId', tagController.fetchTagsByUserId);
router.get('/:tagId/user/:userId', tagController.fetchTagByUserId);
router.post('/', tagController.createTag);

export default router;