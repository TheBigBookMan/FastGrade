import prisma from '../utils/prisma.js';

class SettingsService {
    async getSettingsByUserId(userId) {
        return prisma.settings.findUnique({
            where: { userId }
        });
    }
}

export default new SettingsService();