export interface FeedbackData {
    title: string;
    description: string;
    userId: string;
}

export interface FeedbackResponse {
    success: boolean;
    message?: string;
}