import prisma from '../utils/prisma.js';

class SettingsService {
    async getSettingsByUserId(userId) {
        const settings = await prisma.settings.findUnique({
            where: { userId }
        });

        return settings?.settings || {};
    }
}

export default new SettingsService();