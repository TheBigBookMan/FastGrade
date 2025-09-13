import { useState } from "react";
import { MdEdit, MdDelete, MdMoreVert, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { Comment } from "../../../types/commentTypes.ts";
import { Category } from "../../../types/categoryTypes.ts";
import { toast } from "sonner";
import Input from "../../common/layout/Input.tsx";
import ConfirmationModal from "../../common/layout/ConfirmationModal.tsx";
import { useUpdateComment, useDeleteComment } from "../../../hooks/useComment.ts";

interface CommentCardProps {
    comment: Comment;
    category: Category;
    userId: string;
    allCategories: Category[];
}

const CommentCard = ({ comment, category, userId, allCategories }: CommentCardProps) => {
    const {mutateAsync, isPending} = useUpdateComment(userId, comment.id);
    const {mutateAsync: deleteMutateAsync, isPending: isDeletePending} = useDeleteComment(userId, comment.id);
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editData, setEditData] = useState({
        title: comment.title || '',
        body: comment.body,
        categoryId: category.id || ''
    });

    const handleDelete = async (): Promise<void> => {
        try {

            const response = await deleteMutateAsync();

            if(!response.success) {
                toast.error(response.message || 'Failed to delete comment');
            } else {
                toast.success('Comment deleted successfully');
            }
            setShowMenu(false);
            setShowDeleteConfirm(false);
            
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete comment');
            console.error('Network / Technical error', err);
            setShowMenu(false);
            setShowDeleteConfirm(false);
            return;
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setShowMenu(false);
    };

    const handleSave = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        if (!editData.body.trim()) {
            toast.error('Comment body is required');
            return;
        }

        try {

            const response = await mutateAsync({
                ...editData,
                userId,
                commentId: comment.id
            });

            if(response.success) {
                toast.success('Comment successfully updated');
                setIsEditing(false);
            } else {
                toast.error(response.message || 'Failed to update comment');
            }

        } catch(err: any) {
            toast.error(err.message || 'Failed to update comment');
            console.error('Network / Technical error', err);
        }
    };

    const handleCancel = () => {
        setEditData({
            title: comment.title || '',
            body: comment.body,
            categoryId: category.id || ''
        });
        setIsEditing(false);
    };

    const openDeleteConfirm = () => {
        setShowDeleteConfirm(true);
        setShowMenu(false);
    };

    const toggleFavorite = async () => {
        // Mock favorite toggle - just show success message
        toast.success(comment.isFavourite ? 'Removed from favorites' : 'Added to favorites');
    };

    return (
        <>
            <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200 hover:border-secondary-300 transition-colors">
                {isEditing ? (
                    <div className="space-y-3">
                        <Input
                            label="Title (Optional)"
                            value={editData.title}
                            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Comment title"
                            className="text-sm"
                            fullWidth
                        />
                        <Input
                            as="textarea"
                            label="Comment"
                            value={editData.body}
                            onChange={(e) => setEditData(prev => ({ ...prev, body: e.target.value }))}
                            placeholder="Your comment..."
                            rows={3}
                            className="text-sm"
                            fullWidth
                        />
                        {/* Category Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Category
                            </label>
                            <select
                                value={editData.categoryId}
                                onChange={(e) => setEditData(prev => ({ ...prev, categoryId: e.target.value }))}
                                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-sm"
                            >
                                <option value="">No category</option>
                                {allCategories
                                    .filter(cat => cat.id !== 'other') // Exclude "Other" category
                                    .map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={handleCancel}
                                className="px-3 py-1 text-sm bg-secondary-200 hover:bg-secondary-300 text-secondary-700 rounded transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-3 py-1 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                {comment.title && (
                                    <h4 className="font-medium text-secondary-900 mb-1">
                                        {comment.title}
                                    </h4>
                                )}
                                <p className="text-secondary-700 text-sm leading-relaxed">
                                    {comment.body}
                                </p>
                                <div className="flex items-center gap-4 mt-3 text-xs text-secondary-500">
                                    <span>Used {comment.useCount} times</span>
                                    {comment.lastUsedAt && (
                                        <span>Last used: {new Date(comment.lastUsedAt).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleFavorite}
                                    className="p-1 hover:bg-secondary-200 rounded transition-colors"
                                    title={comment.isFavourite ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                    {comment.isFavourite ? (
                                        <MdFavorite className="w-4 h-4 text-error-500" />
                                    ) : (
                                        <MdFavoriteBorder className="w-4 h-4 text-secondary-400" />
                                    )}
                                </button>
                                
                                <div className="relative">
                                    <button
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="p-1 hover:bg-secondary-200 rounded transition-colors"
                                    >
                                        <MdMoreVert className="w-4 h-4" />
                                    </button>
                                    
                                    {showMenu && (
                                        <div className="absolute right-0 top-full mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                                            <button
                                                onClick={handleEdit}
                                                className="w-full px-3 py-2 text-left hover:bg-secondary-50 flex items-center gap-2 text-sm"
                                            >
                                                <MdEdit className="w-4 h-4" />
                                                Edit
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
                )}
            </div>

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                title="Delete Comment"
                message={`Are you sure you want to delete this comment? This action cannot be undone.`}
                confirmText="Delete Comment"
                cancelText="Cancel"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                isLoading={false}
            />
        </>
    );
};

export default CommentCard;
