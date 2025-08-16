import prisma from '../utils/prisma.js';
import defaultSettings from '../config/defaultSettings.json' assert { type: "json" };


class SettingsService {
    async getSettingsByUserId(userId) {
        const settings = await prisma.settings.findUnique({
            where: { userId }
        });

        return settings?.settings || defaultSettings;
    }

    async createSettings(userId) {
        const newSettings = await prisma.settings.create({
            data: { userId, settings: defaultSettings }
        });

        return newSettings;
    }
}

export default new SettingsService();