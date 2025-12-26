import { api } from "../utils/api";
import { CategoryResponse, CategoryData } from "../types/categoryTypes";

class CategoryService {
    async createCategory(data: CategoryData): Promise<CategoryResponse> {
        const response = await api.post('/category', data);
        return response.data;
    }

    async getCategories(userId: string): Promise<CategoryResponse> {
        const response = await api.get(`/category/${userId}`);
        return response.data;
    }

    async updateCategory(categoryId: string, userId: string, data: Partial<CategoryData>): Promise<CategoryResponse> {
        const response = await api.put(`/category/${categoryId}/user/${userId}`, data);
        return response.data;
    }

    async updateCategoryOrder(userId: string, categoryIds: string[]): Promise<CategoryResponse> {
        const response = await api.put(`/category/user/${userId}/order`, { categoryIds });
        return response.data;
    }

    async deleteCategory(categoryId: string, userId: string): Promise<CategoryResponse> {
        const response = await api.delete(`/category/${categoryId}/user/${userId}`);
        return response.data;
    }
}

export default new CategoryService();