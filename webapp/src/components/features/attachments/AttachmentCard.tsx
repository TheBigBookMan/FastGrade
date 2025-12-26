import { useState } from "react";
import { MdMoreVert, MdDelete, MdDownload, MdImage, MdPictureAsPdf, MdInsertDriveFile } from "react-icons/md";
import { Attachment } from "../../../types/attachmentTypes.ts";
import { toast } from "sonner";
import ConfirmationModal from "../../common/layout/ConfirmationModal.tsx";

interface AttachmentCardProps {
    attachment: Attachment;
    onPreview: (attachment: Attachment) => void;
    onDelete: (attachmentId: string) => void;
}

const AttachmentCard = ({ attachment, onPreview, onDelete }: AttachmentCardProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) {
            return <MdImage className="w-8 h-8 text-primary-600" />;
        } else if (mimeType === 'application/pdf') {
            return <MdPictureAsPdf className="w-8 h-8 text-error-600" />;
        } else {
            return <MdInsertDriveFile className="w-8 h-8 text-secondary-600" />;
        }
    };

    const isImage = attachment.mimeType.startsWith('image/');

    const handleDelete = async () => {
        onDelete(attachment.id);
        setShowMenu(false);
        setShowDeleteConfirm(false);
        toast.success('Attachment deleted successfully');
    };

    const handleDownload = () => {
        // Mock download - in real app, this would trigger actual download
        toast.success('Download started');
        setShowMenu(false);
    };

    const handlePreview = () => {
        onPreview(attachment);
        setShowMenu(false);
    };

    const openDeleteConfirm = () => {
        setShowDeleteConfirm(true);
        setShowMenu(false);
    };

    return (
        <>
            <div className="bg-white rounded-lg border border-secondary-200 hover:border-secondary-300 transition-colors group">
                {/* Thumbnail/Preview Area */}
                <div 
                    className="aspect-square bg-secondary-50 rounded-t-lg overflow-hidden cursor-pointer relative"
                    onClick={handlePreview}
                >
                    {isImage ? (
                        <img
                            src={attachment.thumbnailUrl || attachment.url}
                            alt={attachment.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            {getFileIcon(attachment.mimeType)}
                        </div>
                    )}
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="bg-white bg-opacity-90 rounded-full p-2">
                                <MdImage className="w-6 h-6 text-secondary-700" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* File Info */}
                <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-secondary-900 text-sm truncate" title={attachment.originalName}>
                                {attachment.originalName}
                            </h4>
                            <p className="text-xs text-secondary-500 mt-1">
                                {formatFileSize(attachment.fileSize)}
                            </p>
                            <p className="text-xs text-secondary-400 mt-1">
                                {new Date(attachment.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-1 hover:bg-secondary-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <MdMoreVert className="w-4 h-4 text-secondary-500" />
                            </button>
                            
                            {showMenu && (
                                <div className="absolute right-0 top-full mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg py-1 z-10 min-w-[140px] animate-in fade-in-0 zoom-in-95 duration-150">
                                    <button
                                        onClick={handlePreview}
                                        className="w-full px-3 py-2 text-left hover:bg-secondary-50 flex items-center gap-2 text-sm"
                                    >
                                        <MdImage className="w-4 h-4" />
                                        Preview
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="w-full px-3 py-2 text-left hover:bg-secondary-50 flex items-center gap-2 text-sm"
                                    >
                                        <MdDownload className="w-4 h-4" />
                                        Download
                                    </button>
                                    <button
                                        onClick={openDeleteConfirm}
                                        className="w-full px-3 py-2 text-left hover:bg-secondary-50 text-error-600 flex items-center gap-2 text-sm"
                                    >
                                        <MdDelete className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                title="Delete Attachment"
                message={`Are you sure you want to delete "${attachment.originalName}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                isLoading={false}
            />
        </>
    );
};

export default AttachmentCard;
