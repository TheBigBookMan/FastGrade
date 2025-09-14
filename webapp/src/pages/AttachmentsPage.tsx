import { useState, useMemo } from "react";
import Header from "../components/common/layout/header/Header";
import AttachmentGrid from "../components/features/attachments/AttachmentGrid";
import UploadAttachmentModal from "../components/features/attachments/UploadAttachmentModal";
import ImagePreviewModal from "../components/features/attachments/ImagePreviewModal";
import LoadingSpinner from "../components/common/layout/LoadingSpinner";
import ErrorState from "../components/common/layout/ErrorState";
import { Attachment } from "../types/attachmentTypes.ts";
import { useAuth } from "../contexts/AuthContext.tsx";
import { toast } from "sonner";

const AttachmentsPage = () => {
    const { user } = useAuth();
    if (!user) return null;

    // Mock data - in real app, this would come from API
    const [attachments, setAttachments] = useState<Attachment[]>([
        {
            id: "1",
            name: "grading-rubric",
            originalName: "Grading Rubric.pdf",
            fileType: "pdf",
            fileSize: 1024000,
            mimeType: "application/pdf",
            url: "/mock-files/grading-rubric.pdf",
            userId: user.id,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: "2",
            name: "essay-template",
            originalName: "Essay Template.png",
            fileType: "png",
            fileSize: 512000,
            mimeType: "image/png",
            url: "https://picsum.photos/400/300?random=1",
            thumbnailUrl: "https://picsum.photos/200/150?random=1",
            userId: user.id,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
            id: "3",
            name: "feedback-checklist",
            originalName: "Feedback Checklist.jpg",
            fileType: "jpg",
            fileSize: 768000,
            mimeType: "image/jpeg",
            url: "https://picsum.photos/400/300?random=2",
            thumbnailUrl: "https://picsum.photos/200/150?random=2",
            userId: user.id,
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            updatedAt: new Date(Date.now() - 259200000).toISOString()
        },
        {
            id: "4",
            name: "assessment-criteria",
            originalName: "Assessment Criteria.pdf",
            fileType: "pdf",
            fileSize: 2048000,
            mimeType: "application/pdf",
            url: "/mock-files/assessment-criteria.pdf",
            userId: user.id,
            createdAt: new Date(Date.now() - 345600000).toISOString(),
            updatedAt: new Date(Date.now() - 345600000).toISOString()
        },
        {
            id: "5",
            name: "grade-scale",
            originalName: "Grade Scale.png",
            fileType: "png",
            fileSize: 256000,
            mimeType: "image/png",
            url: "https://picsum.photos/400/300?random=3",
            thumbnailUrl: "https://picsum.photos/200/150?random=3",
            userId: user.id,
            createdAt: new Date(Date.now() - 432000000).toISOString(),
            updatedAt: new Date(Date.now() - 432000000).toISOString()
        }
    ]);

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sort attachments by creation date (newest first)
    const sortedAttachments = useMemo(() => {
        return [...attachments].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [attachments]);

    const handleUpload = async (file: File, name: string) => {
        setIsLoading(true);
        setError(null);

        try {
            // Mock upload - in real app, this would call the API
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newAttachment: Attachment = {
                id: Date.now().toString(),
                name: name.toLowerCase().replace(/\s+/g, '-'),
                originalName: file.name,
                fileType: file.name.split('.').pop() || '',
                fileSize: file.size,
                mimeType: file.type,
                url: file.type.startsWith('image/') 
                    ? `https://picsum.photos/400/300?random=${Date.now()}` 
                    : `/mock-files/${file.name}`,
                thumbnailUrl: file.type.startsWith('image/') 
                    ? `https://picsum.photos/200/150?random=${Date.now()}` 
                    : undefined,
                userId: user.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            setAttachments(prev => [newAttachment, ...prev]);
            toast.success('File uploaded successfully');
        } catch (err) {
            setError('Failed to upload file');
            toast.error('Failed to upload file');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreview = (attachment: Attachment) => {
        setPreviewAttachment(attachment);
        setIsPreviewModalOpen(true);
    };

    const handleDelete = async (attachmentId: string) => {
        try {
            // Mock delete - in real app, this would call the API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setAttachments(prev => prev.filter(att => att.id !== attachmentId));
            toast.success('Attachment deleted successfully');
        } catch (err) {
            toast.error('Failed to delete attachment');
        }
    };

    const handleClosePreview = () => {
        setPreviewAttachment(null);
        setIsPreviewModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-secondary-50">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <LoadingSpinner text="Loading attachments..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-secondary-50">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <ErrorState 
                        message={error}
                        onRetry={() => setError(null)} 
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary-50">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary-900">Attachments</h1>
                        <p className="text-secondary-600 mt-1">
                            Upload and manage your files for quick reference
                        </p>
                    </div>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <span>+</span>
                        Upload File
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border border-secondary-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-100 rounded-lg">
                                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-600">Total Files</p>
                                <p className="text-2xl font-semibold text-secondary-900">{attachments.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-secondary-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-info-100 rounded-lg">
                                <svg className="w-5 h-5 text-info-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-600">Images</p>
                                <p className="text-2xl font-semibold text-secondary-900">
                                    {attachments.filter(att => att.mimeType.startsWith('image/')).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-secondary-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary-100 rounded-lg">
                                <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-600">Documents</p>
                                <p className="text-2xl font-semibold text-secondary-900">
                                    {attachments.filter(att => att.mimeType === 'application/pdf').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attachments Grid */}
                <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
                    <AttachmentGrid
                        attachments={sortedAttachments}
                        onPreview={handlePreview}
                        onDelete={handleDelete}
                    />
                </div>

                {/* Upload Modal */}
                {isUploadModalOpen && (
                    <UploadAttachmentModal
                        isOpen={isUploadModalOpen}
                        onClose={() => setIsUploadModalOpen(false)}
                        onUpload={handleUpload}
                    />
                )}

                {/* Preview Modal */}
                <ImagePreviewModal
                    attachment={previewAttachment}
                    isOpen={isPreviewModalOpen}
                    onClose={handleClosePreview}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default AttachmentsPage;