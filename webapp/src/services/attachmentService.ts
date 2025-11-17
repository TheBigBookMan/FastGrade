import {api} from '../utils/api';

class AttachmentService {
    async uploadAttachment(formData: FormData, userId: string) {
        const response = await api.post(`/attachment/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    }
}

export default new AttachmentService();