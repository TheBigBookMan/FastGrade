import { useMutation, useQuery } from "@tanstack/react-query";
import categoryService from "../services/categoryService";
import { CategoryData } from "../types/categoryTypes";

// Query keys
export const categoryKeys = {
    all: ['categories'] as const,
    lists: () => [...categoryKeys.all, 'list'] as const,
    list: (filters: string) => [...categoryKeys.lists(), { filters }] as const,
    details: () => [...categoryKeys.all, 'detail'] as const,
    detail: (id: string) => [...categoryKeys.details(), id] as const,
};

export const useCreateCategory = () => {
    return useMutation({mutationFn: (data: CategoryData) => categoryService.createCategory(data)});
}

export const useCategories = (userId: string) => {
    return useQuery({
        queryKey: categoryKeys.list(userId),
        queryFn: async () => {
            const response = await categoryService.getCategories(userId);
            return response.data || [];
        }
    })
}