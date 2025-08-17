import feedbackService from '../services/feedbackService.js';
import returnError from "../middleware/returnError.js";
import returnSuccess from "../middleware/returnSuccess.js";

class FeedbackController {
    async fetchAllFeedback (req, res) {
        try {

            const feedback = await feedbackService.fetchAllFeedback();

            return returnSuccess.successFetch(res, feedback, 'feedback');

        } catch(err) {
            return returnError.internalError(res, 'Error fetching feedback', err);
        }
    }

    async createFeedback(req, res) {
        try {

            const {title, description, userId} = req.body;

            await feedbackService.createFeedback(
                title,
                description,
                userId
            );

            return returnSuccess.successCreate(res, 'Successfully created feedback');

        } catch(err) {
            return returnError.internalError(res, 'Error creating feedback', err);
        }
    }

    async fetchFeedbackByUser(req, res) {
        try {

            const {feedbackId, userId} = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!feedbackId) return returnError.loggerWarnRequiredAttribute(res, 'feedback', 'feedbackId');

            const feedback = await feedbackService.fetchFeedbackByUser(feedbackId, userId);

            return returnSuccess.successFetch(res, feedback, 'feedback');

        } catch(err) {
            return returnError.internalError(res, 'Error fetching feedback', err);
        }
    }

    async fetchAllFeedbackByUser(req, res) {
        try {

            const {userId} = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);

            const feedback = await feedbackService.fetchAllFeedbackByUser(userId);

            return returnSuccess.successFetch(res, feedback, 'feedback');

        } catch(err) {
            return returnError.internalError(res, 'Error fetching feedback', err);
        }
    }
}

export default new FeedbackController();