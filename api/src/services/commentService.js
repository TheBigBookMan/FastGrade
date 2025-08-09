import prisma from '../utils/prisma.js';

class CommentService {
    async getCommentsByUserId (userId) {
        return prisma.comment.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                include: {
                category: true, // optional: include category info
            },
        });
    }

    async createComment({ userId, title, body, categoryId, keywords }) {
        return prisma.comment.create({
            data: {
                userId,
                title,
                body,
                categoryId,
                keywords
            }
        });
    }
}

export default new CommentService();