import logger from "../utils/logger.js";

class ReturnError {
    loggerWarnUserId = (res) => {
        logger.warn('Missing userId in request params');
        return res.status(400).json({ 
            success: false,
            message: 'User ID is required',
            timestamp: new Date().toISOString()
        });
    };

    loggerWarnRequiredAttribute = (res, entity, attribute) => {
        logger.warn(`Missing ${entity} ${attribute} in request`);
        return res.status(400).json({ 
            success: false,
            message: `${entity} ${attribute} is required` ,
            timestamp: new Date().toISOString()
        });
    };

    internalError = (res, msg, err) => {
        logger.error({msg, err});
        return res.status(500).json({             
            success: false,
            message: 'Internal server error',
            timestamp: new Date().toISOString() 
        });
    };

    notFound(res, resource = 'Resource') {
        logger.warn(`${resource} not found or doesn't belong to this user`);
        return res.status(404).json({
            success: false,
            message: `${resource} not found or doesn't belong to this user`,
            timestamp: new Date().toISOString()
        });
    }
}

export default new ReturnError();