import { useState } from "react";
import Button from "../../common/layout/Button.tsx";
import Input from "../../common/layout/Input.tsx";
import { Category } from "../../../types/categoryTypes.ts";
import { toast } from "sonner";

interface CreateCommentModalProps {
    isOpen: boolean;
    userId: string;
    categories: Category[];
    onClose: () => void;
    preselectedCategoryId?: string;
}

const CreateCommentModal = ({ 
    isOpen, 
    userId, 
    categories, 
    onClose, 
    preselectedCategoryId 
}: CreateCommentModalProps) => {
    const [formData, setFormData] = useState({
        title: "",
        body: "",
        categoryId: preselectedCategoryId || ""
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!userId) return;

        if (!formData.body.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        // Mock create - just show success message
        toast.success('Comment successfully created');
        setFormData({ title: "", body: "", categoryId: preselectedCategoryId || "" });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-bold text-secondary-900 mb-4">Create New Comment</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Title (Optional)"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Comment title"
                    />
                    
                    <Input
                        as="textarea"
                        label="Comment"
                        value={formData.body}
                        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                        placeholder="Your comment..."
                        rows={4}
                        required
                    />

                    {categories.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Category (Optional)
                            </label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                            >
                                <option value="">No category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            fullWidth
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                        >
                            Create Comment
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCommentModal;
