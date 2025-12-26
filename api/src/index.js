import 'dotenv/config';
import app from './app.js';
import logger from './utils/logger.js';

const port = Number(process.env.PORT || 5000);

app.listen(port, () => {
    logger.info(`API listening on :${port}`);
});
