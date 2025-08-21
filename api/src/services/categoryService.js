import prisma from "../utils/prisma.js";

class CategoryService {
    async getCategoriesByUserId(userId, includeComments = false) {
        return prisma.category.findMany({
            where: {userId},
            orderBy: {order: 'asc'},
            include: {
                comments: includeComments
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

    async getCategoryByUserId (userId, categoryId, includeComments) {
        return prisma.category.findUnique({
            where: {userId, id: categoryId},
            include: {
                comments: includeComments
            }
        });
    }

    async updateCategoryByUserId (userId, categoryId, { name, description, order }) {
        return prisma.category.update({
            where: {id: categoryId, userId},
            data: { name, 
                description, 
                order, 
                updatedAt: new Date() 
            }
        });
    }

    async deleteCategory(categoryId) {
        return prisma.category.delete({
            where: {id: categoryId}
        });
    }

    async updateCategoryOrder(categoryIds) {
        await prisma.$transaction(
            categoryIds.map((catId, idx) => prisma.category.update({
                where: {id: catId},
                data: {
                    order: idx + 1
                }
            }))
        );
    }
}

export default new CategoryService();