import prisma from "../utils/prisma";

class FeedbackService {
    async fetchAllFeedback() {
        return prisma.feedback.findMany();
    }
}

export default new FeedbackService();