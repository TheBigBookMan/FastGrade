import logger from "../utils/logger.js";
import commentService from '../services/commentService.js';
import returnError from "../utils/returnError.js";

class CommentController {
    async fetchCommentsByUserId (req, res) {
        try {

            const { userId } = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);

            const comments = await commentService.getCommentsByUserId(userId);

            return res.json(comments);

        } catch (err) {
            logger.error({ msg: 'Error fetching comments by userId', err });
            return returnError.internalError(res);
        }
    }

    async postComment (req, res) {
        try {

            const { userId } = req.params;
            const { body, categoryId, keywords, title } = req.body;

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!body) return returnError.loggerWarnRequiredAttribute(res, 'comment', 'body');

            const newComment = await commentService.createComment({
                userId,
                body,
                categoryId,
                keywords, title
            });

            return res.status(201).json(newComment);

        } catch(err) {
            logger.error({ msg: 'Error creating comment', err });
            return returnError.internalError(res);
        }
    }
}

export default new CommentController();