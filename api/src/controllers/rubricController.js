import logger from "../utils/logger.js";
import rubricService from '../services/rubricService.js';
import returnError from "../middleware/returnError.js";
import returnSuccess from "../middleware/returnSuccess.js";

class RubricController {
    async fetchRubricsByUserId (req, res) {
        try {

            const {userId} = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);

            const rubrics = await rubricService.getRubricsByUserId(userId);

            return res.json(rubrics);

        } catch(err) {
            return returnError.internalError(res, 'Error fetching rubrics by userId', err);
        }
    }

    async postRubric(req, res) {
        try {

            const {userId} = req.params;
            const {name, description, imageURL} = req.body;

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!name) return returnError.loggerWarnRequiredAttribute(res, 'rubric', 'name');

            const newRubric = await rubricService.createRubric({
                userId, 
                name,
                description,
                imageURL
            });

            return res.status(201).json(newRubric);
            
        } catch(err) {
            return returnError.internalError(res, 'Error creating rubric', err);
        }
    }

    async fetchRubricByUserId (req, res) {
        try {

            const {userId, rubricId} = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!rubricId) return returnError.loggerWarnRequiredAttribute(res, 'rubric', 'rubricId');

            const rubric = await rubricService.getRubricByUserId(userId, rubricId);

            return res.json(rubric);
            
        } catch(err) {
            return returnError.internalError(res, 'Error fetching rubric', err);
        }
    }
}

export default new RubricController();