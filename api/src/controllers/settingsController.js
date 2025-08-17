import logger from '../utils/logger.js';
import settingsService from '../services/settingsService.js';
import returnError from '../middleware/returnError.js';
import returnSuccess from '../middleware/returnSuccess.js';

class SettingsController {
    async fetchSettingsByUserId(req, res) {
        try {
            const { userId } = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);

            const settings = await settingsService.getSettingsByUserId(userId);

            return res.json(settings);
        } catch (err) {
            return returnError.internalError(res, 'Error fetching settings by user id', err);
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
            return returnError.internalError(res, 'Error posting settings', err);
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
            return returnError.internalError(res, 'Error putting settings', err);
        }
    }

    async setDefaultSettings(req, res) {
        try {
            const { userId } = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);

            const defaultSettings = await settingsService.setDefaultSettings(userId);

            return res.json(defaultSettings);
        }
        catch (err) {
            return returnError.internalError(res, 'Error setting default settings', err);
        }
    }
}

export default new SettingsController();