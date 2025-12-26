import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import CategoryCard from "./CategoryCard";
import { Category } from "../../../types/categoryTypes";

interface CategoryListProps {
    categories: Category[];
    onOrderChange: (categories: Category[]) => void;
    userId: string;
}

const CategoryList = ({ categories, onOrderChange, userId }: CategoryListProps) => {
    const [openMenuId, setOpenMenuId] = useState<string>('');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = categories.findIndex(cat => cat.id === active.id);
            const newIndex = categories.findIndex(cat => cat.id === over?.id);

            const newOrder = arrayMove(categories, oldIndex, newIndex);
            
            const updatedItems = newOrder.map((item, index) => ({
                ...item,
                order: index + 1
            }));

            onOrderChange(updatedItems);
        }
    };

    const handleMenuOpen = (categoryId: string) => {
        setOpenMenuId(categoryId);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-4 border-b border-secondary-200">
                <h2 className="text-lg font-medium text-secondary-900">Category Order</h2>
                <p className="text-sm text-secondary-600">Drag and drop to reorder categories</p>
            </div>
            
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={categories.map(cat => cat.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="divide-y divide-secondary-200">
                        {categories.map((category) => (
                            <CategoryCard 
                                key={category.id}
                                category={category}
                                userId={userId}
                                onMenuOpen={handleMenuOpen}
                                isMenuOpen={openMenuId === category.id}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default CategoryList;