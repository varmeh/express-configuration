const os = require('os')
const { createLogger, format, transports } = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')

require('dotenv').config()

const { combine, timestamp, json, colorize, printf } = format

const logFormat = printf(
	({ level, message, host, timestamp, service, env }) => {
		return `${level} - ${timestamp} - ${host} - ${service} - ${env} - ${message}`
	}
)

const consoleFormat = printf(({ level, timestamp, message }) => {
	return `${level} - ${timestamp} - ${message}`
})

const timestampFormat = timestamp({
	format: 'MM-DD-YYYY HH:mm:ss'
})

const consoleTransportOptions = {
	level: 'debug',
	format: combine(colorize(), timestampFormat, consoleFormat)
}

const fileTransportOptions = {
	level: 'debug',
	filename: 'combined-%DATE%.log',
	datePattern: 'YYYY-MM-DD',
	dirname: 'logs',
	zippedArchive: true,
	maxSize: '100m',
	maxFiles: '15d',
	format: combine(timestampFormat, logFormat)
}

const httpTransportOptions = service => ({
	level: 'info',
	host: 'http-intake.logs.datadoghq.com',
	path: `/v1/input/${process.env.DD_API_KEY}?ddsource=nodejs&service=${service}`,
	ssl: true,
	format: combine(timestampFormat, logFormat, json())
})

const logger = (service, isDdogLogging = true, env = 'prod') => {
	if (!service) {
		throw new Error('Missing Mandatory Parameter - service')
	}

	const logger = createLogger({
		exitOnError: false,
		defaultMeta: {
			env,
			service,
			host: os.hostname()
		},
		transports: [
			new transports.Console(consoleTransportOptions),
			new DailyRotateFile(fileTransportOptions)
		]
	})

	if (isDdogLogging) {
		if (!process.env.DD_API_KEY) {
			throw new Error(
				'DD_API_KEY missing. Set this variable to your Datadog Agent API Key'
			)
		}
		logger.add(new transports.Http(httpTransportOptions(service)))
	}

	// create a stream object with a 'write' function that will be used by `morgan`
	logger.stream = {
		write: function (message) {
			// use the 'info' log level so the output will be picked up by both transports (file and console)
			logger.info(message)
		}
	}

	return logger
}

module.exports = logger
