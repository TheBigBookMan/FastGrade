import { Router } from "express";
import categoryController from '../controllers/categoryController.js';

const router = Router();

router.get('/:userId', categoryController.fetchCategoriesByUserId);
router.get('/category:/categoryId/user/:userId', categoryController.fetchCategoriesByUserId);
router.post('/', categoryController.postCategory);

export default router;