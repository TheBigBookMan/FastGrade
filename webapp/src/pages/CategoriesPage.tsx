import { useState, useEffect } from "react";
import Header from "../components/common/layout/header/Header";
import CategoryList from "../components/features/categories/CategoryList";
import CreateCategoryModal from "../components/features/categories/CreateCategoryModal";
import { Category } from "../types/categoryTypes.ts";
import { useAuth } from "../contexts/AuthContext.tsx";
import { useCategories, useUpdateCategoryOrder } from "../hooks/useCategory.ts";
import LoadingSpinner from "../components/common/layout/LoadingSpinner.tsx";
import ErrorState from "../components/common/layout/ErrorState.tsx";
import { toast } from "sonner";

const CategoriesPage = () => {
    const {user} = useAuth();
    if(!user) return;

    const {data: apiCategories = [], isLoading, error} = useCategories(user.id);
    const updateCategoryOrder = useUpdateCategoryOrder();

    const [localCategories, setLocalCategories] = useState<Category[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect((): void => {
        if (isLoading || hasUnsavedChanges) return;

        setLocalCategories(apiCategories);
    }, [apiCategories, isLoading, hasUnsavedChanges]);

    const handleOrderChange = (newOrder: Category[]): void => {
        const updatedOrder = newOrder.map((category, index) => ({
            ...category,
            order: index + 1
        }));

        setLocalCategories(updatedOrder);
        setHasUnsavedChanges(true);
    };

    const handleSaveOrder = async (): Promise<void> => {
        try {
            const categoryIds = localCategories.map(cat => cat.id);
            const response = await updateCategoryOrder.mutateAsync({
                userId: user.id,
                categoryIds
            });

            if(response.success) {
                setHasUnsavedChanges(false);
                toast.success(response.message || 'Category order successfully updated');
            } else {
                toast.error(response.message || 'Failed to update category order');
            }
        } catch (err: any) {
            console.error('Failed to save category order:', err);
            toast.error(err.message || 'Failed to create category');
        }
    };

    return (
        <div className="min-h-screen bg-secondary-50">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-secondary-900">Categories</h1>
                    <div className="flex items-center gap-3">
                        {hasUnsavedChanges && (
                            <button
                                onClick={handleSaveOrder}
                                disabled={updateCategoryOrder.isPending}
                                className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
                            >
                                {updateCategoryOrder.isPending ? 'Saving...' : 'Save Order'}
                            </button>
                        )}
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            disabled={isLoading}
                            className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:cursor-not-allowed"
                        >
                            <span>+</span>
                            Add Category
                        </button>
                    </div>
                </div>
                
                {/* Content Area */}
                <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-12">
                    {isLoading ? (
                        <LoadingSpinner 
                            size="lg" 
                            text="Loading categories..." 
                            showText={true}
                            className="space-y-4"
                        />
                    ) : error ? (
                        <ErrorState 
                            title="Failed to load categories"
                            message="There was an error loading your categories. Please try refreshing the page."
                        />
                    ) : localCategories && localCategories.length > 0 ? (
                        <CategoryList
                            userId={user.id}
                            categories={localCategories}
                            onOrderChange={handleOrderChange}
                        />
                    ) : (
                        <p className="text-secondary-600 text-lg font-medium text-center">
                            No categories found
                        </p>
                    )}
                </div>
                
                {localCategories && (
                    <CreateCategoryModal
                        userId={user.id}
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default CategoriesPage;