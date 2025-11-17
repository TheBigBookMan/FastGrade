import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import attachmentService from "../services/attachmentService.ts";

export const attachmentKeys = {
    all: ['attachments'] as const,
    lists: () => [...attachmentKeys.all, 'list'] as const,
    list: (userId: string) => [...attachmentKeys.lists(), userId] as const,
};

export const useCreateAttachment = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FormData) => attachmentService.uploadAttachment(data, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: attachmentKeys.list(userId) });
        }
    });
};
