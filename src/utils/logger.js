import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logDirectory = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

/**
 * Create a Winston logger with multiple transports
 * @returns {winston.Logger} Configured logger instance
 */
const createLogger = () => {
    return winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.json()
        ),
        transports: [
            // Console transport
            new winston.transports.Console({
                format: winston.format.simple()
            }),
            
            // File transport for info and above logs
            new winston.transports.File({
                filename: path.join(logDirectory, 'combined.log'),
                level: 'info'
            }),
            
            // Separate file for error logs
            new winston.transports.File({
                filename: path.join(logDirectory, 'error.log'),
                level: 'error'
            })
        ]
    });
};

/**
 * Logger for tracking file retrieval events
 */
const logger = createLogger();

/**
 * Log file retrieval attempt
 * @param {Object} options - Logging options
 * @param {string} options.filePath - Path of the file being retrieved
 * @param {string} options.clientIp - IP address of the client
 * @param {boolean} [options.success=true] - Whether retrieval was successful
 */
export const logFileRetrieval = ({ filePath, clientIp, success = true }) => {
    console.log(`File retrieval: ${filePath} by ${clientIp}, Success: ${success}`);
    const logMethod = success ? 'info' : 'warn';
    logger[logMethod]('File Retrieval', {
        filePath,
        clientIp,
        success,
        timestamp: new Date().toISOString()
    });
};

/**
 * Log file retrieval errors
 * @param {Object} error - Error object
 * @param {string} filePath - Path of the file that caused the error
 */
export const logFileRetrievalError = (error, filePath) => {
    console.error(`File retrieval error: ${error.message} for file ${filePath}`);
    logger.error('File Retrieval Error', {
        error: error.message,
        filePath,
        stack: error.stack,
        timestamp: new Date().toISOString()
    });
};

export default logger;