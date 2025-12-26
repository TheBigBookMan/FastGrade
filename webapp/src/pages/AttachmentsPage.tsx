import { useState, useMemo } from "react";
import Header from "../components/common/layout/header/Header";
import AttachmentGrid from "../components/features/attachments/AttachmentGrid";
import UploadAttachmentModal from "../components/features/attachments/UploadAttachmentModal";
import ImagePreviewModal from "../components/features/attachments/ImagePreviewModal";
import SearchAndFilter from "../components/features/attachments/SearchAndFilter";
import LoadingSpinner from "../components/common/layout/LoadingSpinner";
import ErrorState from "../components/common/layout/ErrorState";
import { Attachment } from "../types/attachmentTypes.ts";
import { useAuth } from "../contexts/AuthContext.tsx";
import { toast } from "sonner";
import {useCreateAttachment} from "../hooks/useAttachment.ts";

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
    const createAttachment = useCreateAttachment(user.id);
    
    // Search and filter state
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFileType, setSelectedFileType] = useState("");

    // Filter and sort attachments
    const filteredAndSortedAttachments = useMemo(() => {
        let filtered = [...attachments];

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(attachment =>
                attachment.originalName.toLowerCase().includes(searchLower) ||
                attachment.name.toLowerCase().includes(searchLower)
            );
        }

        // Apply file type filter
        if (selectedFileType) {
            filtered = filtered.filter(attachment => {
                switch (selectedFileType) {
                    case 'image':
                        return attachment.mimeType.startsWith('image/');
                    case 'pdf':
                        return attachment.mimeType === 'application/pdf';
                    case 'other':
                        return !attachment.mimeType.startsWith('image/') && 
                               attachment.mimeType !== 'application/pdf';
                    default:
                        return true;
                }
            });
        }

        // Sort by creation date (newest first)
        return filtered.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [attachments, searchTerm, selectedFileType]);

    const handleUpload = async (file: File, name: string) => {
        if (!user) return;
        setIsLoading(true);
        setError(null);

        try {
            // Prepare FormData for backend API
            const formData = new FormData();
            formData.append("file", file);
            formData.append("name", name);
            formData.append("userId", user.id);

            // Call mutation
            const uploaded = await createAttachment.mutateAsync(formData, user.id);

            // Sync local state (optional if using react-query to fetch attachments)
            setAttachments(prev => [uploaded, ...prev]);

            toast.success("File uploaded successfully");
        } catch (err) {
            console.error(err);
            setError("Failed to upload file");
            toast.error("Failed to upload file");
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
                    

                {/* Search and Filter */}
                <SearchAndFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    selectedFileType={selectedFileType}
                    onFileTypeChange={setSelectedFileType}
                    totalCount={attachments.length}
                    filteredCount={filteredAndSortedAttachments.length}
                />

                {/* Attachments Grid */}
                <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
                    <AttachmentGrid
                        attachments={filteredAndSortedAttachments}
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