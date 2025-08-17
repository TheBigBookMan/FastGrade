import { useState } from "react";
import Button from "../../common/layout/Button.tsx";
import Input from "../../common/layout/Input.tsx";
import { useCreateCategory } from "../../../hooks/useCategory.ts";
import { toast } from "sonner";

interface CreateCategoryModalProps {
    isOpen: boolean;
    userId: string;
    onClose: () => void;
}

const CreateCategoryModal = ({ isOpen, userId, onClose }: CreateCategoryModalProps) => {
    const {mutateAsync, isPending} = useCreateCategory();
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if(!userId) return;

        if(!formData.name) {
            toast.error('Please fill in all fields');
            return;
        }

        try {

            const response = await mutateAsync({
                ...formData,
                userId
            });

            if(response.success) {
                setFormData({ name: "", description: "" });
                onClose();
                toast.success(response.message || 'Category successfully created');
            } else {
                toast.error(response.message || 'Failed to create category');
            }

        } catch(err: any) {
            console.error('Network/Technical error:', err);
            toast.error(err.message || 'Failed to create category');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-bold text-secondary-900 mb-4">Create New Category</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Category Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    
                    <Input
                        label="Description (Optional)"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        as="textarea"
                        rows={3}
                    />
                    
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
                            isLoading={isPending}
                        >
                            Create Category
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCategoryModal;