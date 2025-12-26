import { useState, useEffect } from "react";
import { MdClose, MdZoomIn, MdZoomOut, MdDownload, MdDelete } from "react-icons/md";
import { Attachment } from "../../../types/attachmentTypes.ts";
import { toast } from "sonner";
import ConfirmationModal from "../../common/layout/ConfirmationModal.tsx";

interface ImagePreviewModalProps {
    attachment: Attachment | null;
    isOpen: boolean;
    onClose: () => void;
    onDelete: (attachmentId: string) => void;
}

const ImagePreviewModal = ({ attachment, isOpen, onClose, onDelete }: ImagePreviewModalProps) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setScale(1);
            setPosition({ x: 0, y: 0 });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case '+':
                case '=':
                    handleZoomIn();
                    break;
                case '-':
                    handleZoomOut();
                    break;
                case '0':
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev * 1.2, 5));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev / 1.2, 0.1));
    };

    const handleResetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleDownload = () => {
        // Mock download - in real app, this would trigger actual download
        toast.success('Download started');
    };

    const handleDelete = () => {
        if (attachment) {
            onDelete(attachment.id);
            setShowDeleteConfirm(false);
            onClose();
            toast.success('Attachment deleted successfully');
        }
    };

    const openDeleteConfirm = () => {
        setShowDeleteConfirm(true);
    };

    if (!isOpen || !attachment) return null;

    const isImage = attachment.mimeType.startsWith('image/');

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 animate-in fade-in-0 duration-200">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <h3 className="text-lg font-medium truncate max-w-md">
                            {attachment.originalName}
                        </h3>
                        <span className="text-sm text-gray-300">
                            {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* Zoom Controls */}
                        <div className="flex items-center gap-1 bg-black bg-opacity-50 rounded-lg p-1">
                            <button
                                onClick={handleZoomOut}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                                title="Zoom Out (-)"
                            >
                                <MdZoomOut className="w-5 h-5" />
                            </button>
                            <span className="px-2 text-sm">
                                {Math.round(scale * 100)}%
                            </span>
                            <button
                                onClick={handleZoomIn}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                                title="Zoom In (+)"
                            >
                                <MdZoomIn className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleResetZoom}
                                className="px-3 py-1 text-xs hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                                title="Reset Zoom (0)"
                            >
                                Reset
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <button
                            onClick={handleDownload}
                            className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                            title="Download"
                        >
                            <MdDownload className="w-5 h-5" />
                        </button>
                        <button
                            onClick={openDeleteConfirm}
                            className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors text-red-400"
                            title="Delete"
                        >
                            <MdDelete className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                            title="Close (Esc)"
                        >
                            <MdClose className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Image Container */}
                <div 
                    className="flex-1 flex items-center justify-center p-4 cursor-move"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {isImage ? (
                        <img
                            src={attachment.url}
                            alt={attachment.originalName}
                            className="max-w-full max-h-full object-contain select-none"
                            style={{
                                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                            }}
                            draggable={false}
                        />
                    ) : (
                        <div className="text-center text-white">
                            <div className="text-6xl mb-4">📄</div>
                            <p className="text-lg mb-2">Preview not available</p>
                            <p className="text-sm text-gray-300">
                                This file type cannot be previewed
                            </p>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-sm px-4 py-2 rounded-lg">
                    {isImage && scale > 1 ? (
                        <span>Drag to pan • + / - to zoom • 0 to reset • Esc to close</span>
                    ) : (
                        <span>+ / - to zoom • 0 to reset • Esc to close</span>
                    )}
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

export default ImagePreviewModal;
