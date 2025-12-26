import {useMutation} from "@tanstack/react-query";
import feedbackService from "../services/feedbackService";
import {FeedbackData} from "../types/feedbackTypes";

export const useCreateFeedback = () => {
    return useMutation({mutationFn: (data: FeedbackData) => feedbackService.createFeedback(data)});
}