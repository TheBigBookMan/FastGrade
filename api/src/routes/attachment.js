import { Router } from "express";
import attachmentController from '../controllers/attachmentController.js';

const router = Router();

router.get('/:userId', attachmentController.fetchAttachmentsByUserId);
router.get('/:attachmentId/user/:userId', attachmentController.fetchAttachmentByUserId);
router.post('/:userId', attachmentController.postAttachment);

export default router;