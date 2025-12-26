import prisma from "../utils/prisma.js";

class AttachmentService {
    async fetchAttachmentsByUserId (userId) {
        return prisma.attachment.findMany({
            where: {userId},
            orderBy: {createdAt: 'desc'},
            
        });
    }

    async createAttachment (userId, name, description, imageURL) {
        return prisma.attachment.create({
            data: {
                userId,
                name,
                description,
                imageURL
            }
        });
    }

    async getAttachmentByUserId (userId, attachmentId) {
        return prisma.attachment.findUnique({
            where: {userId, attachmentId}
        });
    }
}

export default new AttachmentService();