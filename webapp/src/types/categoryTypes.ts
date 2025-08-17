export interface Category {
    id: string;
    name: string;
    userId: string;
    description: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryResponse {
    success: boolean;
    message?: string;
    data?: Category | Category[]
}

