import { createLogger, format, transports } from "winston";
import { LOGFILE_NAME, LOGFILE_PATH } from "../../config/project.config";
const { combine, timestamp, json, colorize } = format;

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message}`;
  })
);

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new transports.File({ filename: `${LOGFILE_PATH}/${LOGFILE_NAME}` }),
  ],
});

export default logger;