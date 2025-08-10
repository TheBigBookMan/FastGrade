import { Router } from "express";
import categoryController from '../controllers/categoryController.js';

const router = Router();

router.get('/:userId', categoryController.getCategoryByUserId);

export default router;