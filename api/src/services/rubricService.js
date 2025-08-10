import prisma from "../utils/prisma.js";

class RubricService {
    async fetchRubricsByUserId (userId) {
        return prisma.rubric.findMany({
            where: {userId},
            orderBy: {createdAt: 'desc'},
            
        });
    }
}

export default new RubricService();