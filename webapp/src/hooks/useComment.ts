import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import commentService from "../services/commentService";
import { CommentData } from "../types/commentTypes";

// Query keys
export const commentKeys = {
    all: ['comments'] as const,
    lists: () => [...commentKeys.all, 'list'] as const,
    list: (filters: string) => [...commentKeys.lists(), { filters }] as const,
    details: () => [...commentKeys.all, 'detail'] as const,
    detail: (id: string) => [...commentKeys.details(), id] as const,
};

export const useCreateComment = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CommentData) => commentService.createComment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: commentKeys.list(userId)});
        }
    })
}

export const useComments = (userId: string, includeCategories: boolean) => {
    return useQuery({
        queryKey: commentKeys.list(userId),
        queryFn: async () => {
            const response = await commentService.getComments(userId, includeCategories);
            return response.data || null;
        }
    })
}