import prisma from '../utils/prisma.js';

class AttachmentService {
    async createAttachment(data) {
        const {
            userId,
            name,
            description,
            url,
            thumbnailUrl,
            originalName,
            fileType,
            fileSize,
            mimeType
        } = data;

        return await prisma.attachment.create({
            data: {
                name,
                description,
                userId,
                url,
                thumbnailUrl,
                originalName,
                fileType,
                fileSize,
                mimeType
            }
        });
    }
}

export default new AttachmentService();