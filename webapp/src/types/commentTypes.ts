export interface Comment {
    id: string;
    title: string;
    body: string;
    userId: string;
    categoryId: string;
    isFavourite: Boolean;
    order: number;
    useCount: number;
    lastUsedAt: string;
    keywords: string;
    createdAt: string;
    updatedAt: string;
}

export interface CommentResponse {
    success: boolean;
    message?: string;
    data?: Comment[];
}

export interface CommentData {
    title: string;
    body: string;
    userId: string;
    categoryId: string;
}