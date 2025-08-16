import { Router } from "express";
import categoryController from '../controllers/categoryController.js';

const router = Router();

router.get('/:userId', categoryController.fetchCategoriesByUserId);
router.get('/:categoryId/user/:userId', categoryController.fetchCategoryByUserId);
router.put('/:categoryId/user/:userId', categoryController.updateCategoryByUserId);
router.post('/', categoryController.postCategory);

export default router;