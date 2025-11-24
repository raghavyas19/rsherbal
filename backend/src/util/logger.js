const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// File logging is optional. Set FILE_LOGS=true in env to enable rotating file logs.
const enableFileLogs = String(process.env.FILE_LOGS || '').toLowerCase() === 'true';

let combinedLogger;

if (enableFileLogs) {
    // lazy require to avoid installing rotating-file-stream if not used
    const rfs = require('rotating-file-stream');
    // log directory path
    const logDirectory = path.resolve(__dirname, '../../log');
    // ensure log directory exists
    if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);
    // create a rotating write stream
    const accessLogStream = rfs('access.log', {
        interval: '1d',
        path: logDirectory
    });
    combinedLogger = morgan('combined', { stream: accessLogStream });
} else {
    // default to stdout combined logger when file logging disabled
    combinedLogger = morgan('combined');
}

module.exports = {
    dev: morgan('dev'),
    combined: combinedLogger
};