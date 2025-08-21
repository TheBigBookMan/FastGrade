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

    async createCategory (userId, name, description, order) {
        return prisma.category.create({
            data: {
                userId,
                name,
                description,
                order
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

    async deleteCategory(categoryId, userId) {
        // Use a transaction to delete the category and update order numbers
        return await prisma.$transaction(async (tx) => {
            // First, get the category to be deleted to know its order
            const categoryToDelete = await tx.category.findUnique({
                where: { id: categoryId }
            });

            if (!categoryToDelete) {
                throw new Error('Category not found');
            }

            // Delete the category
            await tx.category.delete({
                where: { id: categoryId }
            });

            // Get all remaining categories for this user, ordered by current order
            const remainingCategories = await tx.category.findMany({
                where: { userId },
                orderBy: { order: 'asc' }
            });

            // Update the order numbers for all remaining categories
            for (let i = 0; i < remainingCategories.length; i++) {
                await tx.category.update({
                    where: { id: remainingCategories[i].id },
                    data: { order: i + 1 }
                });
            }

            return { success: true };
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