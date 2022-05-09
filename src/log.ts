import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;
const timestampFormat = timestamp({
  format: "YYYY-MM-DD HH:mm:ss",
});
const printFormat = printf(
  (info) =>
    `[${info.timestamp}] [${info.level}] - ${info.message}` +
    (info.splat !== undefined ? `${info.splat}` : " ")
);

const format = combine(timestampFormat, colorize(), printFormat);
const nonColorFormat = combine(timestampFormat, printFormat);

const logger = winston.createLogger({
  level: "debug",
  format: nonColorFormat,
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      format: nonColorFormat,
    }),
    new winston.transports.File({
      filename: "combined.log",
      format: nonColorFormat,
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format,
  })
);
export default logger;
