import { Router } from "express";

import commentRouter from './comment.js';
// import categoryRouter from './category.js';
// import userRouter from './user.js';
// import adminRouter from './admin.js';
// import feedbackRouter from './feedback.js';
// import rubricRouter from './rubric.js';

const router = Router();

router.use('/comment', commentRouter);
// router.use('/category', categoryRouter);
// router.use('/user', userRouter);
// router.use('/admin', adminRouter);
// router.use('/feedback', feedbackRouter);
// router.use('/rubric', rubricRouter);

export default router;