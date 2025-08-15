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
}

export default new TagService();