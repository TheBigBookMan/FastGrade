import { Router } from "express";
import categoryController from '../controllers/categoryController.js';

const router = Router();

router.get('/:userId', categoryController.fetchCategoriesByUserId);
router.get('/:categoryId/user/:userId', categoryController.fetchCategoryByUserId);
router.put('/:categoryId/user/:userId', categoryController.updateCategoryByUserId);
router.delete('/:categoryId/user/:userId', categoryController.deleteCategory);
router.post('/', categoryController.postCategory);
router.put('/user/:userId/order', categoryController.updateCategoryOrder);

export default router;