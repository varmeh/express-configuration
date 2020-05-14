const { createLogger, format, transports, config } = require('winston')
const { combine, timestamp, json, colorize, simple } = format
const DailyRotateFile = require('winston-daily-rotate-file')

module.exports = (service, env = 'Prod') => {
	const logger = createLogger({
		exitOnError: false,
		format: combine(
			timestamp({
				format: 'MM-DD-YYYY HH:mm:ss'
			}),
			json()
		),
		defaultMeta: {
			env,
			service
		},
		transports: [
			new transports.Console({
				level: 'debug',
				format: combine(colorize(), simple())
			}),
			new DailyRotateFile({
				level: 'debug',
				filename: 'combined-%DATE%.log',
				datePattern: 'YYYY-MM-DD',
				dirname: 'logs',
				zippedArchive: true,
				maxSize: '100m',
				maxFiles: '15d'
			})
		]
	})

	// create a stream object with a 'write' function that will be used by `morgan`
	logger.stream = {
		write: function (message, encoding) {
			// use the 'info' log level so the output will be picked up by both transports (file and console)
			logger.info(message)
		}
	}

	return logger
}
