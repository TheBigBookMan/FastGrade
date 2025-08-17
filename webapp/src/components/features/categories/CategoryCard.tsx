import { useState } from "react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MdDragIndicator, MdEdit, MdDelete, MdMoreVert } from "react-icons/md";
import { Category } from "../../../types/categoryTypes.ts";

interface CategoryCardProps {
    category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
    const [showMenu, setShowMenu] = useState(false);
    
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center justify-between p-4 hover:bg-secondary-50 transition-colors ${
                isDragging ? 'bg-primary-50 shadow-lg rotate-2' : ''
            }`}
        >
            <div className="flex items-center gap-4">
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
                
                <div>
                    <h3 className="font-medium text-secondary-900">{category.name}</h3>
                    {category.description && (
                        <p className="text-sm text-secondary-600">{category.description}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 relative">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                >
                    <MdMoreVert className="w-5 h-5" />
                </button>
                
                {showMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                        <button className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center gap-2 text-sm">
                            <MdEdit className="w-4 h-4" />
                            Edit
                        </button>
                        <button className="w-full px-4 py-2 text-left hover:bg-secondary-50 text-error-600 flex items-center gap-2 text-sm">
                            <MdDelete className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryCard;