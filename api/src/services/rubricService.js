import prisma from "../utils/prisma.js";

class RubricService {
    async fetchRubricsByUserId (userId) {
        return prisma.rubric.findMany({
            where: {userId},
            orderBy: {createdAt: 'desc'},
            
        });
    }

    async createRubric (userId, name, description, imageURL) {
        return prisma.rubric.create({
            data: {
                userId,
                name,
                description,
                imageURL
            }
        });
    }
}

export default new RubricService();