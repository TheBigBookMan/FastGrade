import logger from '../utils/logger.js';
import settingsService from '../services/settingsService.js';
import returnError from '../utils/returnError.js';

class SettingsController {
    async fetchSettingsByUserId(req, res) {
        try {
            const { userId } = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);

            const settings = await settingsService.getSettingsByUserId(userId);

            return res.json(settings);
        } catch (err) {
            logger.error({ msg: 'Error fetching settings by user id', err });
            return returnError.internalError(res);
        }
    }

    async postSettings(req, res) {
        try {
            const { userId } = req.body;

            if(!userId) return returnError.loggerWarnUserId(res);

            const newSettings = await settingsService.createSettings(userId);

            return res.status(201).json(newSettings);
        }
        catch (err) {
            logger.error({ msg: 'Error posting settings', err });
            return returnError.internalError(res);
        }
    }
}

export default new SettingsController();