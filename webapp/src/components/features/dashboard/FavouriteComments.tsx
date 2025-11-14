import { useState } from "react";
import { MdFavorite, MdClose } from "react-icons/md";
import { Comment } from "../../../types/commentTypes";
import { useUpdateFavouriteComment } from "../../../hooks/useComment";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "sonner";
import LoadingSpinner from "../../common/layout/LoadingSpinner";

interface FavouriteCommentsInterface {
    apiComments: Comment[];
}

interface FavouriteCommentRowProps {
    comment: Comment;
}

const FavouriteCommentRow = ({ comment }: FavouriteCommentRowProps) => {
    const { user } = useAuth();
    const [isRemoving, setIsRemoving] = useState(false);
    const { mutateAsync: mutateFavouriteAsync } = useUpdateFavouriteComment(user?.id || '', comment.id);

    const handleRemoveFavourite = async () => {
        if (!user) return;

        setIsRemoving(true);
        
        try {
            const response = await mutateFavouriteAsync(false);
            
            if (!response.success) {
                toast.error(response.message || 'Failed to remove from favorites');
            } else {
                toast.success('Removed from favorites');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to remove from favorites');
            console.error('Error removing favorite:', err);
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <tr className="hover:bg-secondary-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                {comment.title ? (
                    <span className="text-sm font-medium text-secondary-900 truncate block max-w-xs">
                        {comment.title}
                    </span>
                ) : (
                    <span className="text-sm text-secondary-400">-</span>
                )}
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-secondary-700 line-clamp-2">
                    {comment.body}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-secondary-600 flex items-center gap-1">
                    <MdFavorite className="w-4 h-4 text-error-500" />
                    {comment.useCount}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-secondary-600">
                    {comment.lastUsedAt 
                        ? new Date(comment.lastUsedAt).toLocaleDateString()
                        : '-'
                    }
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                    onClick={handleRemoveFavourite}
                    disabled={isRemoving}
                    className="text-error-600 hover:text-error-700 hover:bg-error-50 px-3 py-1 rounded transition-colors inline-flex items-center gap-1"
                    title="Remove from favorites"
                >
                    {isRemoving ? (
                        <div className="w-4 h-4">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <MdClose className="w-4 h-4" />
                    )}
                </button>
            </td>
        </tr>
    );
};

const FavouriteComments = ({ apiComments }: FavouriteCommentsInterface) => {
    const favouriteComments = apiComments.filter(comment => comment.isFavourite);

    if (favouriteComments.length === 0) {
        return (
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Favourite Comments</h3>
                <div className="bg-white rounded-lg p-8 text-center border border-secondary-200">
                    <MdFavorite className="w-8 h-8 text-secondary-300 mx-auto mb-2" />
                    <p className="text-secondary-500">No favourite comments yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Favourite Comments</h3>
            <div className="bg-white rounded-lg border border-secondary-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-secondary-50 border-b border-secondary-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Comment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Used</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Last Used</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-secondary-700 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200">
                        {favouriteComments.map((comment) => (
                            <FavouriteCommentRow key={comment.id} comment={comment} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FavouriteComments;