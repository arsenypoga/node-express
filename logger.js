const winston = require('winston');
const chalk = require('chalk');
const level = process.env.LOG_LEVEL || 'debug';


const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            name: 'console.debug',
            level: level,
            colorize: true,
            prettyPrint: true,
            timestamp: () => {
                return chalk.cyan((new Date()).toISOString());
            }
        })
    ]
});

logger.stream = {
    write: (message, encoding) => {
        logger.info(message);
    }
}

module.exports = logger;