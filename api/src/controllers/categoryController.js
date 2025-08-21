import categoryService from '../services/categoryService.js';
import returnError from "../middleware/returnError.js";
import returnSuccess from "../middleware/returnSuccess.js";

class CategoryController {
    async fetchCategoriesByUserId (req, res) {
        try {

            const { userId } = req.params;
            const includeComments = req.query.includeComments === 'true';

            if(!userId) return returnError.loggerWarnUserId(res);

            const categories = await categoryService.getCategoriesByUserId(userId, includeComments);

            return returnSuccess.successFetch(res, categories, 'categories');
            
        } catch (err) {
            return returnError.internalError(res, 'Error fetching categories by userId', err);
        }
    }

    async postCategory (req, res) {
        try {

            const {name, description, userId} = req.body;

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!name) return returnError.loggerWarnRequiredAttribute(res, 'category', 'name');

            const categories = await categoryService.getCategoriesByUserId(userId);
            const orderNumber = categories.length + 1;

            await categoryService.createCategory(
                userId,
                name,
                description,
                orderNumber
            );

            return returnSuccess.successCreate(res, 'Successfully created a category');

        } catch(err) {
            return returnError.internalError(res, 'Error creating category', err);
        }
    }

    async fetchCategoryByUserId (req, res) {
        try {

            const {userId, categoryId} = req.params;
            const includeComments = req.query.includeComments === 'true';

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!categoryId) return returnError.loggerWarnRequiredAttribute(res, 'category', 'categoryId');

            const category = await categoryService.getCategoryByUserId(userId, categoryId, includeComments);

            return returnSuccess.successFetch(res, category, 'Successfully fetched a category');
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

            await categoryService.updateCategoryByUserId(userId, categoryId, { name, description, order });

            return returnSuccess.successUpdate(res, 'Successfully updated category');
        }
        catch (err) {
            return returnError.internalError(res, 'Error updating category', err);
        }
    }

    async deleteCategory (req, res) {
        try {
            const {categoryId, userId} = req.params;
            
            if(!userId) return returnError.loggerWarnUserId(res);
            if(!categoryId) return returnError.loggerWarnRequiredAttribute(res, 'category', categoryId);
    
            const category = await categoryService.getCategoryByUserId(userId, categoryId);
    
            if(!category) return returnError.notFound(res, 'Category');
    
            await categoryService.deleteCategory(categoryId, userId);
    
            return returnSuccess.successDelete(res, 'Successfully deleted category');
    
        } catch(err) {
            return returnError.internalError(res, 'Error deleting category', err);
        }
    }

    async updateCategoryOrder(req, res) {
        try {

            const {userId} = req.params;
            const {categoryIds} = req.body;

            if(!userId) return returnError.loggerWarnUserId(res);

            const category = await categoryService.getCategoriesByUserId(userId);
            category.forEach(cat => {
                if(cat.userId !== userId) return returnError.notFound(res, 'Category');
            });

            await categoryService.updateCategoryOrder(categoryIds);

            return returnSuccess.successUpdate(res, 'Successfully update category order');

        } catch(err) {
            return returnError.internalError(res, 'Error updating category order', err);
        }
    }
}

export default new CategoryController();