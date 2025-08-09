import { Router } from "express";

import commentRouter from './comment.js';
// import categoryRouter from './category';
// import userRouter from './user';
// import adminRouter from './admin';

const router = Router();

router.use('/comment', commentRouter);
// router.use('/category', categoryRouter);
// router.use('/user', userRouter);
// router.use('/admin', adminRouter);

export default router;