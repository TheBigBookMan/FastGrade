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

    async getCategoryByUserId (userId, categoryId) {
        return prisma.category.findUnique({
            where: {userId, categoryId}
        });
    }

    async updateCategoryByUserId (userId, categoryId, { name, description, order }) {
        return prisma.category.update({
            where: {categoryId, userId},
            data: { name, 
                description, 
                order, 
                updatedAt: new Date() 
            }
        });
    }
}

export default new CategoryService();