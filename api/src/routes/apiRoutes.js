import { Router } from "express";

import commentRouter from './comment.js';
import categoryRouter from './category.js';
// import userRouter from './user.js';
// import adminRouter from './admin.js';
import feedbackRouter from './feedback.js';
import rubricRouter from './rubric.js';
import tagRouter from './tag.js';
import settingsRouter from './settings.js';

const router = Router();

router.use('/comment', commentRouter);
router.use('/category', categoryRouter);
// router.use('/user', userRouter);
// router.use('/admin', adminRouter);
router.use('/feedback', feedbackRouter);
router.use('/rubric', rubricRouter);
router.use('/tag', tagRouter);
router.use('/settings', settingsRouter);

export default router;