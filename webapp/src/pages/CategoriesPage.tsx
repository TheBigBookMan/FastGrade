import { useState } from "react";
import Header from "../components/common/layout/header/Header";
import CategoryList from "../components/features/categories/CategoryList";
import CreateCategoryModal from "../components/features/categories/CreateCategoryModal";
import { Category } from "../types/categoryTypes.ts";
import { useAuth } from "../contexts/AuthContext.tsx";
import { useCategories } from "../hooks/useCategory.ts";
import LoadingSpinner from "../components/common/layout/LoadingSpinner.tsx";
import ErrorState from "../components/common/layout/ErrorState.tsx";

const CategoriesPage = () => {
    const {user} = useAuth();
    if(!user) return;

    const {data: categories = [], isLoading, error} = useCategories(user.id);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const handleOrderChange = (newOrder: Category[]) => {
        // setCategories(newOrder);
        setHasUnsavedChanges(true);
    };

    const handleSaveOrder = () => {
        // TODO: Call API to save the new order
        console.log("Saving new order:", categories);
        setHasUnsavedChanges(false);
        // You can add a toast notification here
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
                                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Save Order
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
                    ) : categories && categories.length > 0 ? (
                        <CategoryList 
                            userId={user.id}
                            categories={categories}
                            onOrderChange={handleOrderChange}
                        />
                    ) : (
                        <p className="text-secondary-600 text-lg font-medium text-center">
                            No categories found
                        </p>
                    )}
                </div>
                
                {categories && (
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