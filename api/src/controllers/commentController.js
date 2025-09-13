import commentService from '../services/commentService.js';
import returnError from "../middleware/returnError.js";
import returnSuccess from "../middleware/returnSuccess.js";

class CommentController {
    async fetchCommentsByUserId (req, res) {
        try {

            const { userId } = req.params;
            const includeCategories = req.query.includeCategories === 'true';

            if(!userId) return returnError.loggerWarnUserId(res);

            const comments = await commentService.getCommentsByUserId(userId, includeCategories);

            return returnSuccess.successFetch(res, comments, 'Successfully fetched comments');

        } catch (err) {
            return returnError.internalError(res, 'Error fetching comments by userId', err);
        }
    }

    async postComment (req, res) {
        try {

            let { userId, body, categoryId, title, isFavourite } = req.body;

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!body) return returnError.loggerWarnRequiredAttribute(res, 'comment', 'body');

            categoryId = categoryId || null;

            await commentService.createComment(
                userId,
                title,
                body,
                categoryId,
                isFavourite
            );

            return returnSuccess.successCreate(res, 'Successfully created a comment');

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

            return returnSuccess.successFetch(res, 'Successfully fetched comment', comment);
        } catch(err) {
            return returnError.internalError(res, 'Error fetching comments', err);
        }
    }

    async updateComment (req, res) {
        try {
            const { userId, commentId } = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!commentId) return returnError.loggerWarnRequiredAttribute(res, 'comment', 'commentId');

            const updatedComment = await commentService.updateComment(userId, commentId, req.body);

            return returnSuccess.successUpdate(res, 'Successfully updated comment', updatedComment);
        }
        catch (err) {
            return returnError.internalError(res, 'Error updating comment', err);
        }
    }

    async deleteComment (req, res) {
        try {

            const { userId, commentId } = req.params;
            
            if(!userId) return returnError.loggerWarnUserId(res);
            if(!commentId) return returnError.loggerWarnRequiredAttribute(res, 'comment', 'commentId');

            const comment = await commentService.getCommentByUserId(userId, commentId);

            if(!comment) return returnError.notFound(res, 'Comment');

            await commentService.deleteComment(userId, commentId);

            return returnSuccess.successDelete(res, 'Successfully deleted comment');

        } catch (err) {
            return returnError.internalError(res, 'Error deleting comment', err);
        }
    }
}

export default new CommentController();