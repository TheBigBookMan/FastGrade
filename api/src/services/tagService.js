import prisma from "../utils/prisma.js";

class TagService {
    async fetchAllTagsByUserId (userId) {
        return prisma.tag.findMany({
            where: {userId}
        });
    } 
}

export default new TagService();