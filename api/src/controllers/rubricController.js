import logger from "../utils/logger.js";
import rubricService from '../services/rubricService.js';
import returnError from "../utils/returnError.js";

class RubricController {
    async fetchRubricsByUserId (req, res) {
        try {

            const {userId} = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);

            const rubrics = await rubricService.getRubricsByUserId(userId);

            return res.json(rubrics);

        } catch(err) {
            logger.error({ msg: 'Error fetching rubrics by userId', err });
            return returnError.internalError(res);
        }
    }
}

export default new RubricController();