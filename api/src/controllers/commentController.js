import logger from "../utils/logger.js";
import commentService from '../services/commentService.js';
import returnError from "../middleware/returnError.js";
import returnSuccess from "../middleware/returnSuccess.js";

class CommentController {
    async fetchCommentsByUserId (req, res) {
        try {

            const { userId } = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);

            const comments = await commentService.getCommentsByUserId(userId);

            return res.json(comments);

        } catch (err) {
            return returnError.internalError(res, 'Error fetching comments by userId', err);
        }
    }

    async postComment (req, res) {
        try {

            const { userId, body, categoryId, keywords, title } = req.body;

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
            return returnError.internalError(res, 'Error creating comment', err);
        }
    }

    async fetchCommentByUserId (req, res) {
        try {

            const {userId, commentId} = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!commentId) return returnError.loggerWarnRequiredAttribute(res, 'comment', 'commentId');

            const comment = await commentService.getCommentByUserId(userId, commentId);

            return res.json(comment);
        } catch(err) {
            return returnError.internalError(res, 'Error fetching comments', err);
        }
    }

    async updateCommentByUserId (req, res) {
        try {
            const { userId, commentId } = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!commentId) return returnError.loggerWarnRequiredAttribute(res, 'comment', 'commentId');

            const updatedComment = await commentService.updateCommentByUserId(userId, commentId, req.body);

            return res.json(updatedComment);
        }
        catch (err) {
            return returnError.internalError(res, 'Error updating comment', err);
        }
    }
}

export default new CommentController();