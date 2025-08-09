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
}

export default new CommentService();