import { useState } from "react";
import { MdExpandMore, MdExpandLess, MdAdd } from "react-icons/md";
import { Category } from "../../../types/categoryTypes.ts";
import { Comment } from "../../../types/commentTypes.ts";
import CommentCard from "./CommentCard.tsx";
import CreateCommentModal from "./CreateCommentModal.tsx";

interface CommentAccordionProps {
    category: Category;
    comments: Comment[];
    isExpanded: boolean;
    onToggle: () => void;
    userId: string;
    allCategories: Category[];
}

const CommentAccordion = ({ 
    category, 
    comments, 
    isExpanded, 
    onToggle, 
    userId,
    allCategories
}: CommentAccordionProps) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const commentCount = comments.length;
    const isOtherCategory = category.id === 'other';

    return (
        <>
            <div className="border-b border-secondary-200 last:border-b-0">
                {/* Category Header */}
                <div
                    onClick={onToggle}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary-50 transition-colors hover:cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            {isExpanded ? (
                                <MdExpandLess className="w-5 h-5 text-secondary-500" />
                            ) : (
                                <MdExpandMore className="w-5 h-5 text-secondary-500" />
                            )}
                            <div className="flex flex-col items-start">
                                <h3 className="text-lg font-semibold text-secondary-900">
                                    {category.name}
                                </h3>
                                {category.description && (
                                    <p className="text-sm text-secondary-600">
                                        {category.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-secondary-500 bg-secondary-100 px-2 py-1 rounded-full">
                            {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
                        </span>
                        {!isOtherCategory && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCreateModalOpen(true);
                                }}
                                className="p-2 hover:bg-primary-100 text-primary-600 rounded-lg transition-colors"
                                title="Add comment to this category"
                            >
                                <MdAdd className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Comments Section */}
                <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="px-6 pb-4">
                        {comments.length > 0 ? (
                            <div className="space-y-3">
                                {comments.map((comment) => (
                                    <CommentCard
                                        key={comment.id}
                                        comment={comment}
                                        category={category}
                                        userId={userId}
                                        allCategories={allCategories}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center">
                                <p className="text-secondary-500">
                                    {isOtherCategory 
                                        ? "No uncategorised comments"
                                        : "No comments in this category yet"
                                    }
                                </p>
                                {!isOtherCategory && (
                                    <button
                                        onClick={() => setIsCreateModalOpen(true)}
                                        className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                                    >
                                        Add your first comment
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Comment Modal */}
            {isCreateModalOpen && (
                <CreateCommentModal
                    userId={userId}
                    categories={[category]}
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    preselectedCategoryId={category.id}
                />
            )}
        </>
    );
};

export default CommentAccordion;
