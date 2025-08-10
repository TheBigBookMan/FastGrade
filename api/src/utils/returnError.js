import logger from "./logger.js";

class ReturnError {
    loggerWarnUserId = (res) => {
        logger.warn('Missing userId in request params');
        return res.status(400).json({ error: 'User ID is required' });
    };

    loggerWarnRequiredAttribute = (res, entity, attribute) => {
        logger.warn(`Missing ${entity} ${attribute} in request`);
        return res.status(400).json({ error: `${entity} ${attribute} is required` });
    };

    internalError = (res) => {
        return res.status(500).json({ error: 'Internal Server Error' });
    };
}

export default new ReturnError();