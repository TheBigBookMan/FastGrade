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

    async getRubricByUserId (userId, rubricId) {
        return prisma.rubric.findUnique({
            where: {userId, rubricId}
        });
    }
}

export default new RubricService();