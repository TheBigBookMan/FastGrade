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

    async putSettings(req, res) {
        try {
            const { userId } = req.params;
            const newSettings = req.body;

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!newSettings || typeof newSettings !== 'object') return returnError.loggerWarnRequiredAttribute(res, 'settings', 'newSettings');

            const updatedSettings = await settingsService.updateSettings(userId, newSettings);

            return res.json(updatedSettings);
        }
        catch (err) {
            logger.error({ msg: 'Error putting settings', err });
            return returnError.internalError(res);
        }
    }
}

export default new SettingsController();