import logger from "../utils/logger,js";
import categoryService from '../services/categoryService.js';
import returnError from "../utils/returnError.js";

class CategoryController {
    async fetchCategoriesByUserId (req, res) {
        try {

            const { userId } = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);

            const categories = await categoryService.getCategoriesByUserId(userId);

            return res.json(categories);
            
        } catch (err) {
            logger.error({ msg: 'Error fetching categories by userId', err });
            return returnError.internalError(res);
        }
    }
}

export default new CategoryController();