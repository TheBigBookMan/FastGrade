import { api } from "../utils/api";
import { Category, CategoryResponse, CategoryData } from "../types/categoryTypes";

class CategoryService {
    async createCategory(data: CategoryData): Promise<CategoryResponse> {
        const response = await api.post('/category', data);
        return response.data;
    }

    async getCategories(userId: string): Promise<CategoryResponse> {
        const response = await api.get(`/category/${userId}`);
        return response.data;
    }
}

export default new CategoryService();