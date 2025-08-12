import logger from "../utils/logger.js";
import feedbackService from '../services/feedbackService.js';
import returnError from "../utils/returnError.js";

class FeedbackController {
    async fetchAllFeedback (req, res) {
        try {

            const feedback = await feedbackService.fetchAllFeedback();

            return res.json(feedback);

        } catch(err) {
            logger.error({ msg: 'Error fetching feedback' }, err);
            return returnError.internalError(res);
        }
    }

    async createFeedback(req, res) {
        try {

            const {title, comment, userId} = req.body;

            const newFeedback = await feedbackService.createFeedback({
                title,
                comment,
                userId
            });

            return res.status(201).json(newFeedback);

        } catch(err) {
            logger.error({ msg: 'Error creating feedback', err });
            return returnError.internalError(res);
        }
    }

    async fetchFeedbackByUser(req, res) {
        try {

            const {feedbackId, userId} = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!feedbackId) return returnError.loggerWarnRequiredAttribute(res, 'feedback', 'feedbackId');

            const feedback = await feedbackService.fetchFeedbackByUser(feedbackId, userId);

            return res.json(feedback);

        } catch(err) {
            logger.error({ msg: 'Error fetching feedback', err });
            return returnError.internalError(res);
        }
    }

    async fetchAllFeedbackByUser(req, res) {
        try {

            const {userId} = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);

            const feedback = await feedbackService.fetchAllFeedbackByUser(userId);

            return res.json(feedback);

        } catch(err) {
            logger.error({ msg: 'Error fetching feedback', err });
            return returnError.internalError(res);
        }
    }
}

export default new FeedbackController();