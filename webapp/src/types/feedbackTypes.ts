export interface FeedbackData {
    title: string;
    description: string;
    userId: string;
}

export interface FeedbackResponse {
    succes: boolean;
    message?: string;
}