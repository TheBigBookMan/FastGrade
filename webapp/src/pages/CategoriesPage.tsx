import { useState } from "react";
import Header from "../components/common/layout/header/Header";
import CategoryList from "../components/features/categories/CategoryList";
import CreateCategoryModal from "../components/features/categories/CreateCategoryModal";
import { Category } from "../types/categoryTypes.ts";

// Mock data
const mockCategories: Category[] = [
    {
        id: "1",
        name: "Grammar & Mechanics",
        description: "Spelling, punctuation, and grammar errors",
        order: 1,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
    },
    {
        id: "2", 
        name: "Content & Structure",
        description: "Essay organization and flow",
        order: 2,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
    },
    {
        id: "3",
        name: "Critical Thinking",
        description: "Analysis and argument strength",
        order: 3,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
    },
    {
        id: "4",
        name: "Research & Citations",
        description: "Source quality and proper citation",
        order: 4,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
    },
    {
        id: "5",
        name: "Style & Voice",
        description: "Writing style and author voice",
        order: 5,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
    }
];

const CategoriesPage = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>(mockCategories);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const handleOrderChange = (newOrder: Category[]) => {
        setCategories(newOrder);
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
                            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <span>+</span>
                            Add Category
                        </button>
                    </div>
                </div>
                
                <CategoryList 
                    categories={categories}
                    onOrderChange={handleOrderChange}
                />
                
                <CreateCategoryModal 
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                />
            </div>
        </div>
    );
};

export default CategoriesPage;