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
}

export default new FeedbackController();