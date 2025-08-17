import prisma from "../utils/prisma.js";

class FeedbackService {
    async fetchAllFeedback() {
        return prisma.feedback.findMany();
    }

    async createFeedback(title, description, userId) {
        return prisma.feedback.create({
            data: {
                userId,
                title,
                description
            }
        });
    }

    async fetchFeedbackByUser(feedbackId, userId) {
        return prisma.feedback.findMany({
            where: {feedbackId, userId}
        });
    }

    async fetchAllFeedbackByUser(userId) {
        return prisma.feedback.findMany({
            where: {userId}
        });
    }
}

export default new FeedbackService();