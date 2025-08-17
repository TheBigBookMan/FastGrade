import { api } from "../utils/api";
import {FeedbackData, Feedback} from "../types/feedbackTypes";

class FeedbackService {
    async createFeedback(data: FeedbackData): Promise<Feedback> {
        return await api.post('/feedback', data);
    }
}

export default new FeedbackService();