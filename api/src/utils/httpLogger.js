// utils/httpLogger.js
import pinoHttp from 'pino-http';
import logger from './logger.js';

export default pinoHttp({
    logger,
    customSuccessMessage: function (res) {
        return `request completed with status code ${res.statusCode}`;
    },
    customErrorMessage: function (error, res) {
        return `request errored with status code ${res.statusCode}: ${error.message}`;
    },
});
