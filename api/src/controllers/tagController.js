import logger from "../utils/logger.js";
import tagService from '../services/tagService.js';
import returnError from "../utils/returnError.js";

class TagController {
    async fetchTagsByUserId(req, res) {
        try {

            const {userId} = req.params;
            if(!userId) return returnError.loggerWarnUserId(res);

            const tags = await tagService.fetchAllTagsByUserId(userId);

            return res.json(tags);

        } catch(err) {
            logger.error({ msg: 'Error fetching tags by userId', err });
            return returnError.internalError(res);
        }
    }

    async fetchTagByUserId(req, res) {
        try {

            const {userId, tagId} = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!tagId) return returnError.loggerWarnRequiredAttribute(res, 'tag', 'tagId');

            const tag = await tagService.fetchTagByUserId(userId, tagId);

            return res.json(tag);

        } catch(err) {
            logger.error({ msg: 'Error fetching tag by userId', err });
            return returnError.internalError(res);
        }
    }
}

export default new TagController();