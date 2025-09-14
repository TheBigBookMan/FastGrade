import { useState, useRef } from "react";
import { MdClose, MdCloudUpload, MdImage, MdInsertDriveFile } from "react-icons/md";
import { toast } from "sonner";
import Button from "../../common/layout/Button.tsx";
import Input from "../../common/layout/Input.tsx";

interface UploadAttachmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File, name: string) => void;
}

const UploadAttachmentModal = ({ isOpen, onClose, onUpload }: UploadAttachmentModalProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [customName, setCustomName] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        // Validate file type (images and PDFs for now)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please select an image (JPEG, PNG, GIF, WebP) or PDF file');
            return;
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            toast.error('File size must be less than 10MB');
            return;
        }

        setSelectedFile(file);
        setCustomName(file.name.split('.')[0]); // Set default name without extension
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select a file to upload');
            return;
        }

        if (!customName.trim()) {
            toast.error('Please enter a name for the file');
            return;
        }

        setIsUploading(true);
        
        try {
            // Mock upload delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            onUpload(selectedFile, customName.trim());
            toast.success('File uploaded successfully');
            
            // Reset form
            setSelectedFile(null);
            setCustomName("");
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            onClose();
        } catch (error) {
            toast.error('Failed to upload file');
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        if (!isUploading) {
            setSelectedFile(null);
            setCustomName("");
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in-0 duration-200">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-secondary-200">
                    <h2 className="text-xl font-semibold text-secondary-900">Upload File</h2>
                    <button
                        onClick={handleClose}
                        disabled={isUploading}
                        className="p-1 hover:bg-secondary-100 rounded transition-colors disabled:opacity-50"
                    >
                        <MdClose className="w-5 h-5 text-secondary-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* File Drop Zone */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                            isDragging 
                                ? 'border-primary-500 bg-primary-50' 
                                : selectedFile 
                                    ? 'border-secondary-300 bg-secondary-50' 
                                    : 'border-secondary-300 hover:border-secondary-400'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {selectedFile ? (
                            <div className="space-y-2">
                                <div className="flex items-center justify-center">
                                    {selectedFile.type.startsWith('image/') ? (
                                        <MdImage className="w-12 h-12 text-primary-600" />
                                    ) : (
                                        <MdInsertDriveFile className="w-12 h-12 text-primary-600" />
                                    )}
                                </div>
                                <p className="text-sm font-medium text-secondary-900">{selectedFile.name}</p>
                                <p className="text-xs text-secondary-500">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <MdCloudUpload className="w-12 h-12 text-secondary-400 mx-auto" />
                                <div>
                                    <p className="text-sm font-medium text-secondary-900">
                                        Drop your file here, or click to browse
                                    </p>
                                    <p className="text-xs text-secondary-500 mt-1">
                                        Images (JPEG, PNG, GIF, WebP) and PDFs up to 10MB
                                    </p>
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                >
                                    Choose File
                                </button>
                            </div>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />

                    {/* Custom Name Input */}
                    {selectedFile && (
                        <Input
                            label="File Name"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            placeholder="Enter a name for this file"
                            fullWidth
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-secondary-200">
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isUploading}
                        fullWidth
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUpload}
                        disabled={!selectedFile || !customName.trim() || isUploading}
                        isLoading={isUploading}
                        fullWidth
                    >
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UploadAttachmentModal;
