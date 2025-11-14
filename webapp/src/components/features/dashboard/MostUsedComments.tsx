import { useState } from "react";
import { MdTrendingUp, MdClose } from "react-icons/md";
import { Comment } from "../../../types/commentTypes";
import { useUpdateFavouriteComment } from "../../../hooks/useComment";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "sonner";
import LoadingSpinner from "../../common/layout/LoadingSpinner";

interface MostUsedCommentsInterface {
    apiComments: Comment[];
}

interface MostUsedCommentRowProps {
    comment: Comment;
    rank: number;
}

const MostUsedCommentRow = ({ comment, rank }: MostUsedCommentRowProps) => {
    const { user } = useAuth();
    const [isRemoving, setIsRemoving] = useState(false);
    const { mutateAsync: mutateFavouriteAsync } = useUpdateFavouriteComment(user?.id || '', comment.id);

    const handleToggleFavourite = async () => {
        if (!user) return;

        setIsRemoving(true);
        
        try {
            const response = await mutateFavouriteAsync(!comment.isFavourite);
            
            if (!response.success) {
                toast.error(response.message || 'Failed to update favorite status');
            } else {
                toast.success(comment.isFavourite ? 'Removed from favorites' : 'Added to favorites');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to update favorite status');
            console.error('Error updating favorite:', err);
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <tr className="hover:bg-secondary-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm">
                    {rank}
                </span>
            </td>
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
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                    <MdTrendingUp className="w-3 h-3" />
                    {comment.useCount} times
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
                    onClick={handleToggleFavourite}
                    disabled={isRemoving}
                    className={`px-3 py-1 rounded transition-colors inline-flex items-center gap-1 ${
                        comment.isFavourite
                            ? 'text-error-600 hover:text-error-700 hover:bg-error-50'
                            : 'text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100'
                    }`}
                    title={comment.isFavourite ? 'Remove from favorites' : 'Add to favorites'}
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

const MostUsedComments = ({ apiComments }: MostUsedCommentsInterface) => {
    const mostUsedComments = [...apiComments]
        .sort((a, b) => b.useCount - a.useCount)
        .slice(0, 10);

    if (mostUsedComments.length === 0) {
        return (
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Most Used Comments</h3>
                <div className="bg-white rounded-lg p-8 text-center border border-secondary-200">
                    <MdTrendingUp className="w-8 h-8 text-secondary-300 mx-auto mb-2" />
                    <p className="text-secondary-500">No comments yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Most Used Comments</h3>
            <div className="bg-white rounded-lg border border-secondary-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-secondary-50 border-b border-secondary-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Rank</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Comment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Usage</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Last Used</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-secondary-700 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200">
                        {mostUsedComments.map((comment, index) => (
                            <MostUsedCommentRow key={comment.id} comment={comment} rank={index + 1} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MostUsedComments;
