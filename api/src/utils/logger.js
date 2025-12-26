import pino from 'pino';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logger = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
        targets: [
            // Console output (for development)
            {
                target: 'pino-pretty',
                level: 'info',
                options: {
                    colorize: true,
                    translateTime: 'SYS:standard'
                }
            },
            // File output for all logs
            {
                target: 'pino/file',
                level: 'info',
                options: {
                    destination: path.join(logsDir, 'app.log'),
                    mkdir: true
                }
            },
            // Separate error log file
            {
                target: 'pino/file',
                level: 'error',
                options: {
                    destination: path.join(logsDir, 'error.log'),
                    mkdir: true
                }
            }
        ]
    }
});

export default logger;