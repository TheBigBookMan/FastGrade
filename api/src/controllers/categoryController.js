import logger from "../utils/logger.js";
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
            return returnError.internalError(res, 'Error fetching categories by userId', err);
        }
    }

    async postCategory (req, res) {
        try {

            const {userId} = req.params;
            const {name, description} = req.body;

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!name) return returnError.loggerWarnRequiredAttribute(res, 'category', 'name');

            const newCategory = await categoryService.createCategory({
                userId,
                name,
                description
            });

            return res.status(201).json(newCategory);

        } catch(err) {
            return returnError.internalError(res, 'Error creating category', err);
        }
    }

    async fetchCategoryByUserId (req, res) {
        try {

            const {userId, categoryId} = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!categoryId) return returnError.loggerWarnRequiredAttribute(res, 'category', 'categoryId');

            const category = await categoryService.getCategoryByUserId(userId, categoryId);

            return res.json(category);
        } catch(err) {
            return returnError.internalError(res, 'Error fetching category', err);
        }
    }

    async updateCategoryByUserId (req, res) {
        try {
            const { userId, categoryId } = req.params;
            const { name, description, order } = req.body;

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!categoryId) return returnError.loggerWarnRequiredAttribute(res, 'category', 'categoryId');

            const updatedCategory = await categoryService.updateCategoryByUserId(userId, categoryId, { name, description, order });

            return res.json(updatedCategory);
        }
        catch (err) {
            return returnError.internalError(res, 'Error updating category', err);
        }
    }
}

export default new CategoryController();