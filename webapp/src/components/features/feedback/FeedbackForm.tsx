import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../common/layout/Button';
import { Input } from '../../common/layout/Input';
import { MdSend } from 'react-icons/md';
import { FeedbackData } from '../../../types/feedbackTypes';
import { useCreateFeedback } from '../../../hooks/useFeedback';
import { toast } from 'sonner';

const FeedbackForm = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState<FeedbackData>({
        title: '',
        description: '',
        userId: user?.id || ''
    });

    const {mutateAsync, isPending} = useCreateFeedback();

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!formData.title || !formData.description || !user?.id) {
            toast.error('Please fill in all fields');
            return;
        }
            try{

                const response = await mutateAsync({
                    ...formData,
                    userId: user.id
                });
                
                if(response.success) {
                    setFormData({ title: '', description: '', userId: user.id });
                    toast.success(response.message || 'Feedback submitted successfully');
                } else {
                    toast.error(response.message || 'Failed to submit feedback');
                }
            } catch(err: any) {
                console.error('Network/Technical error:', err);
                toast.error(err.message || 'Failed to submit feedback');
            } 
        
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Submit Feedback
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Title"
                    placeholder="Brief summary of your feedback"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    fullWidth
                />

                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Tell us more about your feedback..."
                        rows={4}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white resize-none"
                        required
                    />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={isPending}
                    disabled={!formData.title || !formData.description}
                >
                    <MdSend className="w-4 h-4 mr-2" />
                    Submit Feedback
                </Button>
            </form>
        </div>
    );
};

export default FeedbackForm;