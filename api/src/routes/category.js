import { Router } from "express";
import categoryController from '../controllers/categoryController.js';

const router = Router();

router.get('/:userId', categoryController.fetchCategoriesByUserId);
router.post('/:userId', categoryController.postCategory);

export default router;