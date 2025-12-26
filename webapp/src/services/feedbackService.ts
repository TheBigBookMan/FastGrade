import { api } from "../utils/api";
import {FeedbackData, FeedbackResponse} from "../types/feedbackTypes";

class FeedbackService {
    async createFeedback(data: FeedbackData): Promise<FeedbackResponse> {
        const response = await api.post('/feedback', data);
        return response.data;
    }
}

export default new FeedbackService();