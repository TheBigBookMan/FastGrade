import prisma from "../utils/prisma.js";

class CategoryService {
    async getCategoriesByUserId(userId) {
        return prisma.category.findMany({
            where: {userId},
            orderBy: {createdAt: 'desc'},
            include: {
                comment: true
            }
        });
    }

    async createCategory (userId, name, description) {
        return prisma.category.create({
            data: {
                userId,
                name,
                description
            }
        });
    }
}

export default new CategoryService();