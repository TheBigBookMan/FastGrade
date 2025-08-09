import logger from "../utils/logger.js";
import commentService from '../services/commentService.js';

class CommentController {
    async fetchCommentsByUserId (req, res) {
        try {

            const { userId } = req.params;

            if(!userId) {
                logger.warn('Missing userId in request params');
                return res.status(400).json({ error: 'User ID is required' });
            }

            const comments = await commentService.getCommentsByUserId(userId);

            return res.json(comments);

        } catch (err) {
            logger.error({ msg: 'Error fetching commens by userId', err });
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new CommentController();