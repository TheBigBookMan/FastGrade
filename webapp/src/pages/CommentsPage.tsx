import { useState, useMemo } from "react";
import Header from "../components/common/layout/header/Header";
import CommentAccordion from "../components/features/comments/CommentAccordion";
import CreateCommentModal from "../components/features/comments/CreateCommentModal";
import LoadingSpinner from "../components/common/layout/LoadingSpinner";
import ErrorState from "../components/common/layout/ErrorState";
import { Category } from "../types/categoryTypes.ts";
import { Comment } from "../types/commentTypes.ts";
import { useAuth } from "../contexts/AuthContext.tsx";
import { useComments } from "../hooks/useComment.ts";
import { useCategories } from "../hooks/useCategory.ts";

const CommentsPage = () => {
    const { user } = useAuth();
    if (!user) return null;

    const { data: comments, isLoading: commentsLoading, error: commentsError } = useComments(user.id, false);
    const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories(user.id);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    // Group comments by category
    const commentsByCategory = useMemo(() => {
        if (!comments) return {};
        
        const grouped: Record<string, Comment[]> = {};
        
        comments.forEach((comment) => {
            const categoryId = comment.categoryId || 'other';
            if (!grouped[categoryId]) {
                grouped[categoryId] = [];
            }
            grouped[categoryId].push(comment);
        });
        
        return grouped;
    }, [comments]);

    // Create "Other" category for uncategorized comments
    const allCategories = useMemo(() => {
        // Filter out any existing "other" categories to prevent duplicates
        const categoryList: Category[] = (categories || []).filter(cat => cat.id !== 'other');
        
        // Only add "Other" category if there are uncategorized comments
        if (commentsByCategory['other'] && commentsByCategory['other'].length > 0) {
            const otherCategory: Category = {
                id: 'other',
                name: 'Other',
                description: 'Uncategorized comments',
                userId: user.id,
                order: categoryList.length + 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            categoryList.push(otherCategory);
        }
        
        return categoryList;
    }, [categories, commentsByCategory, user.id]);

    const toggleCategory = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    // Loading state
    if (commentsLoading || categoriesLoading) {
        return (
            <div className="min-h-screen bg-secondary-50">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    // Error state
    if (commentsError || categoriesError) {
        return (
            <div className="min-h-screen bg-secondary-50">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <ErrorState 
                        message="Failed to load comments or categories" 
                        onRetry={() => window.location.reload()} 
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
                    <h1 className="text-3xl font-bold text-secondary-900">Comments</h1>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <span>+</span>
                        Add Comment
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
                    {allCategories.length > 0 ? (
                        <div className="divide-y divide-secondary-200">
                            {allCategories.map((category) => (
                                <CommentAccordion
                                    key={category.id}
                                    category={category}
                                    comments={commentsByCategory[category.id] || []}
                                    isExpanded={expandedCategories.has(category.id)}
                                    onToggle={() => toggleCategory(category.id)}
                                    userId={user.id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-12">
                            <p className="text-secondary-600 text-lg font-medium text-center">
                                No comments found
                            </p>
                        </div>
                    )}
                </div>

                {isCreateModalOpen && (
                    <CreateCommentModal
                        userId={user.id}
                        categories={categories || []}
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default CommentsPage;