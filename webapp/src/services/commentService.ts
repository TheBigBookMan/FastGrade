import { api } from "../utils/api";
import { CommentResponse, CommentData, EditCommentData } from "../types/commentTypes";

class CommentService {
    async createComment(data: CommentData): Promise<CommentResponse> {
        const response = await api.post('/comment', data);
        return response.data;
    }

    async getComments(userId: string, includeCategories = false): Promise<CommentResponse> {
        const response = await api.get(`/comment/${userId}?includeCategories=${includeCategories}`);
        return response.data;
    }

    async updateComment(userId: string, commentId: string, data: Partial<EditCommentData>): Promise<CommentResponse> {
        const response = await api.put(`/comment/${commentId}/user/${userId}`, data);
        return response.data;
    }

    async deleteComment(userId: string, commentId: string): Promise<CommentResponse> {
        const response = await api.delete(`/comment/${commentId}/user/${userId}`);
        return response.data;
    }
}

export default new CommentService();