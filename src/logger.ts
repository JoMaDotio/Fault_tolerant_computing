import { createLogger, transports, format } from "winston"

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level}: ${message}`;
        })
    ),
    defaultMeta: { service: "assigment_4"},
    transports: [
        new transports.Console(),
        new transports.File({ filename: "errors.log", level: "error"}),
        new transports.File({ filename: 'combined.log' }),
    ]
})

export default logger;