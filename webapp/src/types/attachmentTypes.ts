export interface Attachment {
    id: string;
    name: string;
    originalName: string;
    fileType: string;
    fileSize: number;
    mimeType: string;
    url: string;
    thumbnailUrl?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface AttachmentData {
    name: string;
    file: File;
}

export interface AttachmentResponse {
    success: boolean;
    message: string;
    data?: Attachment;
    timestamp: string;
}

export interface AttachmentsResponse {
    success: boolean;
    message: string;
    data?: Attachment[];
    timestamp: string;
}
