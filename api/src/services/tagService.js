import prisma from "../utils/prisma.js";

class TagService {
    async fetchAllTagsByUserId (userId) {
        return prisma.tag.findMany({
            where: {userId}
        });
    } 

    async fetchTagByUserId(userId, tagId) {
        return prisma.tag.findUnique({
            where: {
                userId,
                tagId
            }
        });
    }

    async createTag(userId, commentId, name) {
        return prisma.tag.create({
            data: {
                userId, 
                commentId,
                name
            }
        });
    }
}

export default new TagService();