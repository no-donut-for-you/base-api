const { createLogger, transports, format } = require('winston')

const init = () => {
  const config = {
    levels: {
      error: 0,
      debug: 1,
      warn: 2,
      info: 3,
    },
    colors: {
      error: 'red',
      debug: 'magenta',
      warn: 'yellow',
      info: 'green',
    },
  }

  const logger = createLogger({
    handleExceptions: true,
    levels: config.levels,
    format: format.combine(
      format.colorize(),
      format.simple(),
    ),

    transports: [
      new transports.Console(),
      new transports.File({
        filename: `logs/${process.env.NODE_ENV}.log`,
      }),
    ],
  })

  logger.stream = {
    write: (log) => {
      logger.info(log)
    },
  }

  return logger
}

module.exports = { init }
