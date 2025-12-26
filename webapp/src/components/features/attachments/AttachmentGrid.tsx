import { Attachment } from "../../../types/attachmentTypes.ts";
import AttachmentCard from "./AttachmentCard.tsx";

interface AttachmentGridProps {
    attachments: Attachment[];
    onPreview: (attachment: Attachment) => void;
    onDelete: (attachmentId: string) => void;
}

const AttachmentGrid = ({ attachments, onPreview, onDelete }: AttachmentGridProps) => {
    if (attachments.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-secondary-900 mb-2">No attachments yet</h3>
                <p className="text-secondary-500 max-w-sm mx-auto">
                    Upload your first file to get started. You can upload images, PDFs, and other documents.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {attachments.map((attachment) => (
                <AttachmentCard
                    key={attachment.id}
                    attachment={attachment}
                    onPreview={onPreview}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default AttachmentGrid;
