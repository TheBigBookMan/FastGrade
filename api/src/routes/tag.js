import { Router } from "express";
import tagController from '../controllers/tagController.js';

const router = Router();

router.get('/:userId', tagController.fetchTagsByUserId);

export default router;