import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const useCreateCategory = (userId: string) => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: CategoryData) => categoryService.createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.list(userId) });
        }
    });
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

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({categoryId, userId}: {categoryId: string, userId: string}) => categoryService.deleteCategory(categoryId, userId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.list(variables.userId) })
        }
    })
}

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({categoryId, userId, data}: {categoryId: string, userId: string, data: Partial<CategoryData>}) => categoryService.updateCategory(categoryId, userId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.userId) });
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
        }
    })
}