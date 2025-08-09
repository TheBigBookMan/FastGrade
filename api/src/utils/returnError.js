import logger from "./logger.js";

class ReturnError {
    loggerWarnUserId = (res) => {
        logger.warn('Missing userId in request params');
        return res.status(400).json({ error: 'User ID is required' });
    };

    loggerWarnBody = (res) => {
        logger.warn('Missing comment body in request');
        return res.status(400).json({ error: 'Comment body is required' });
    };

    internalError = (res) => {
        return res.status(500).json({ error: 'Internal Server Error' });
    };
}

export default new ReturnError();