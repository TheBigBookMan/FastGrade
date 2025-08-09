import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import httpLogger from './utils/httpLogger.js';
import logger from './utils/logger.js';
import apiRoutes from './routes/apiRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(httpLogger);
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api', apiRoutes);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
app.listen(port, () => logger.info(`API listening on :${port}`));
