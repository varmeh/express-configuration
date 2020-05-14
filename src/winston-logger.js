const { createLogger, format, transports, config } = require('winston')
const { combine, timestamp, json, colorize, printf } = format
const DailyRotateFile = require('winston-daily-rotate-file')

const logFormat = printf(({ level, message, timestamp, service, env }) => {
	return `${level} - ${timestamp} - ${service} - ${env} - ${message}`
})

const timestampFormat = timestamp({
	format: 'MM-DD-YYYY HH:mm:ss'
})

module.exports = (service, env = 'Prod') => {
	const logger = createLogger({
		exitOnError: false,
		defaultMeta: {
			env,
			service
		},
		transports: [
			new transports.Console({
				level: 'debug',
				format: combine(colorize(), timestampFormat, logFormat)
			}),
			new DailyRotateFile({
				level: 'debug',
				filename: 'combined-%DATE%.log',
				datePattern: 'YYYY-MM-DD',
				dirname: 'logs',
				zippedArchive: true,
				maxSize: '100m',
				maxFiles: '15d',
				format: combine(timestampFormat, logFormat)
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
