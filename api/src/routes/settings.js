import { Router } from "express";
import settingsController from '../controllers/settingsController.js';

const router = Router();

router.get('/:userId', settingsController.fetchSettingsByUserId);
router.post('/', settingsController.postSettings);
router.put('/:userId', settingsController.putSettings);

export default router;