import { useState } from "react";
import Header from "../components/common/layout/header/Header";
import CommentAccordion from "../components/features/comments/CommentAccordion";
import CreateCommentModal from "../components/features/comments/CreateCommentModal";
import { Category } from "../types/categoryTypes.ts";
import { Comment } from "../types/commentTypes.ts";

// Mock data
const mockCategories: Category[] = [
    {
        id: '1',
        name: 'Code Review',
        description: 'Comments for code review feedback',
        order: 1,
        userId: 'user1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        name: 'Bug Reports',
        description: 'Comments for bug reports and issues',
        order: 2,
        userId: 'user1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '3',
        name: 'Feature Requests',
        description: 'Comments for new feature ideas',
        order: 3,
        userId: 'user1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    }
];

const mockComments: Comment[] = [
    {
        id: '1',
        title: 'Great work on the refactoring',
        body: 'The code is much cleaner now. Good job breaking down the complex function into smaller, more manageable pieces.',
        userId: 'user1',
        categoryId: '1',
        isFavourite: true,
        order: 1,
        useCount: 5,
        lastUsedAt: '2024-01-15T10:30:00Z',
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
    },
    {
        id: '2',
        title: 'Consider adding error handling',
        body: 'This function could benefit from better error handling, especially for edge cases.',
        userId: 'user1',
        categoryId: '1',
        isFavourite: false,
        order: 2,
        useCount: 2,
        lastUsedAt: '2024-01-12T14:20:00Z',
        createdAt: '2024-01-11T00:00:00Z',
        updatedAt: '2024-01-12T14:20:00Z'
    },
    {
        id: '3',
        title: 'Login page crashes on mobile',
        body: 'The login page crashes when accessed from mobile devices. Steps to reproduce: 1. Open app on mobile 2. Try to login 3. App crashes',
        userId: 'user1',
        categoryId: '2',
        isFavourite: true,
        order: 1,
        useCount: 8,
        lastUsedAt: '2024-01-16T09:15:00Z',
        createdAt: '2024-01-13T00:00:00Z',
        updatedAt: '2024-01-16T09:15:00Z'
    },
    {
        id: '4',
        title: 'Add dark mode support',
        body: 'It would be great to have a dark mode option for better user experience, especially for users who work in low-light environments.',
        userId: 'user1',
        categoryId: '3',
        isFavourite: false,
        order: 1,
        useCount: 3,
        lastUsedAt: '2024-01-14T16:45:00Z',
        createdAt: '2024-01-14T00:00:00Z',
        updatedAt: '2024-01-14T16:45:00Z'
    },
    {
        id: '5',
        title: 'Quick note about performance',
        body: 'The dashboard loads a bit slow on slower connections. Maybe we can optimize the data fetching.',
        userId: 'user1',
        categoryId: undefined, // This will go to "Other"
        isFavourite: false,
        order: 1,
        useCount: 1,
        lastUsedAt: '2024-01-15T11:00:00Z',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T11:00:00Z'
    }
];

const CommentsPage = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    // Organize comments by category
    const commentsByCategory = mockComments.reduce((acc, comment) => {
        const categoryId = comment.categoryId || 'other';
        if (!acc[categoryId]) {
            acc[categoryId] = [];
        }
        acc[categoryId].push(comment);
        return acc;
    }, {} as Record<string, Comment[]>);

    // Create "Other" category for comments without a category
    const allCategories = [...mockCategories];
    if (commentsByCategory['other'] && commentsByCategory['other'].length > 0) {
        allCategories.push({
            id: 'other',
            name: 'Other',
            description: 'Comments without a category',
            order: mockCategories.length + 1,
            userId: 'user1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
    }

    const toggleCategory = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

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
                                    userId="user1"
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
                        userId="user1"
                        categories={mockCategories}
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default CommentsPage;