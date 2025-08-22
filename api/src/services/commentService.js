import prisma from '../utils/prisma.js';

class CommentService {
    async getCommentsByUserId (userId, includeCategories = false) {
        return prisma.comment.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                include: {
                category: includeCategories,
            },
        });
    }

    async createComment(userId, title, body, categoryId, keywords) {

    }

    async getCommentByUserId (userId, commentId) {
        return prisma.comment.findUnique({
            where: {commentId, userId}
        });
    }

    async updateCommentByUserId (userId, commentId, updatedComment) {
        return prisma.comment.update({
            where: {commentId, userId},
            data: { 
                ...updatedComment, 
                updatedAt: new Date() 
            }
        });
    }
}

export default new CommentService();