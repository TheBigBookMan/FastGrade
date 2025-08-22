import { api } from "../utils/api";
import { CommentResponse, CommentData } from "../types/commentTypes";

class CommentService {
    async createComment(data: CommentData): Promise<CommentResponse> {
        const response = await api.post('/comment', data);
        return response.data;
    }
}

export default new CommentService();