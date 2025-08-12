import prisma from "../utils/prisma";

class FeedbackService {
    async fetchAllFeedback() {
        return prisma.feedback.findMany();
    }

    async createFeedback(title, comment, userId) {
        return prisma.feedback.create({
            data: {
                userId,
                title,
                comment
            }
        });
    }
}

export default new FeedbackService();