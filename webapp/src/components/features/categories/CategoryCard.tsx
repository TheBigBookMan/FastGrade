import { useState } from "react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MdDragIndicator, MdEdit, MdDelete, MdMoreVert, MdCheck, MdClose } from "react-icons/md";
import { Category } from "../../../types/categoryTypes.ts";
import { useDeleteCategory, useUpdateCategory } from "../../../hooks/useCategory.ts";
import { toast } from "sonner";
import LoadingSpinner from "../../common/layout/LoadingSpinner.tsx";
import Input from "../../common/layout/Input.tsx";

interface CategoryCardProps {
    category: Category;
    userId: string;
}

const CategoryCard = ({ category, userId }: CategoryCardProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: category.name,
        description: category.description || ''
    });

    const deleteCategory = useDeleteCategory();
    const updateCategory = useUpdateCategory();
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: category.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleDelete = async () => {
        try {
            await deleteCategory.mutateAsync({ categoryId: category.id, userId: category.userId });
            toast.success('Category deleted successfully');
            setShowMenu(false);
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setShowMenu(false);
    };

    const handleSave = async () => {
        if (!editData.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        try {
            await updateCategory.mutateAsync({
                categoryId: category.id,
                userId: userId,
                data: {
                    name: editData.name.trim(),
                    description: editData.description.trim() || undefined
                }
            });
            toast.success('Category updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update category');
        }
    };

    const handleCancel = () => {
        setEditData({
            name: category.name,
            description: category.description || ''
        });
        setIsEditing(false);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center justify-between p-4 hover:bg-secondary-50 transition-colors ${
                isDragging ? 'bg-primary-50 shadow-lg rotate-2' : ''
            } ${deleteCategory.isPending ? 'opacity-50' : ''}`}
        >
            <div className="flex items-center gap-4 flex-1">
                <div
                    {...attributes}
                    {...listeners}
                    className="flex items-center gap-2 text-secondary-500 cursor-grab active:cursor-grabbing"
                >
                    <MdDragIndicator className="w-5 h-5" />
                    <span className="text-sm font-medium bg-secondary-100 px-2 py-1 rounded">
                        #{category.order}
                    </span>
                </div>

                {isEditing ? (
                    <div className="flex-1 space-y-2">
                        <Input
                            value={editData.name}
                            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Category name"
                            className="text-sm"
                            fullWidth
                        />
                        <Input
                            as="textarea"
                            value={editData.description}
                            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Description (optional)"
                            rows={2}
                            className="text-sm"
                            fullWidth
                        />
                    </div>
                ) : (
                    <div className="flex-1">
                        <h3 className="font-medium text-secondary-900">{category.name}</h3>
                        {category.description && (
                            <p className="text-sm text-secondary-600">{category.description}</p>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                {isEditing ? (
                    <div className='ml-4 flex gap-2'>
                        <button
                            onClick={handleSave}
                            disabled={updateCategory.isPending}
                            className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            {updateCategory.isPending ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <MdCheck className="w-4 h-4" />
                            )}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={updateCategory.isPending}
                            className="p-2 bg-error-500 hover:bg-error-600 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            <MdClose className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            disabled={deleteCategory.isPending}
                            className="p-2 hover:bg-secondary-200 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <MdMoreVert className="w-5 h-5" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                                <button
                                    onClick={handleEdit}
                                    className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center gap-2 text-sm"
                                >
                                    <MdEdit className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleteCategory.isPending}
                                    className="w-full px-4 py-2 text-left hover:bg-secondary-50 text-error-600 flex items-center gap-2 text-sm disabled:opacity-50"
                                >
                                    {deleteCategory.isPending ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <>
                                            <MdDelete className="w-4 h-4" />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryCard;