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
}

export default new CategoryService();