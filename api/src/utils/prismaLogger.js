import logger from './logger.js';

export default {
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        }
    ],
    error: (e) => logger.error({ prisma: true, error: e }),
    query: (e) => logger.debug({ prisma: true, query: e.query, params: e.params }),
};
