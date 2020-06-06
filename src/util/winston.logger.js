import os from 'os'
import stringify from 'json-stringify-safe'

import DailyRotateFile from 'winston-daily-rotate-file'
import { createLogger, format, transports } from 'winston'
import { name as serviceName } from '../../package.json'

const { combine, json, colorize, printf } = format

const logFormat = printf(
	({ level, timestamp, service, host, message }) =>
		`${level} - ${timestamp} - ${service} - ${host} - ${stringify(
			message,
			null,
			4
		)}`
)

const consoleFormat = printf(
	({ level, timestamp, service, message }) =>
		`${level} - ${timestamp} - ${service} - ${stringify(message, null, 2)}`
)

const timestampFormat = format.timestamp({
	format: 'MM-DD-YYYY HH:mm:ss'
})

const consoleTransportOptions = {
	format: combine(colorize(), timestampFormat, consoleFormat),
	level: 'debug',
	silent: process.env.NODE_ENV === 'test'
}

const fileTransportOptions = (service, logsfolder) => ({
	datePattern: 'YYYY-MM-DD',
	dirname: logsfolder,
	filename: `${service}-%DATE%.log`,
	format: combine(timestampFormat, logFormat),
	level: 'debug',
	maxFiles: '15d',
	maxSize: '100m',
	silent: process.env.NODE_ENV === 'test',
	zippedArchive: false
})

const httpTransportOptions = service => ({
	format: combine(timestampFormat, logFormat, json()),
	host: 'http-intake.logs.datadoghq.com',
	level: 'info',
	path: `/v1/input/${process.env.DD_API_KEY}?ddsource=nodejs&service=${service}`,
	silent: process.env.NODE_ENV === 'test',
	ssl: true
})

/**
 * Create a custom Winston logger instance
 * @param {Object} options - configurable via Node env variables:
 * 				 			NODE_ENV
 * 							LOGS_FOLDER
 * 							DD_API_KEY
 * @param {string} service - service name
 * @returns {winston.logger}
 */
export const createWinstonLogger = (
	service,
	{
		env = process.env.NODE_ENV || 'dev',
		logsFolder = process.env.LOGS_FOLDER || 'logs',
		ddogApiKey = process.env.DD_API_KEY,
		consoleLogging = true,
		dataDogLogging = false
	} = {}
) => {
	if (!service) {
		throw new Error('Missing Mandatory Parameter - service')
	}

	const logger = createLogger({
		defaultMeta: {
			env,
			host: os.hostname(),
			service
		},
		exitOnError: false,
		transports: [new DailyRotateFile(fileTransportOptions(service, logsFolder))]
	})

	if (consoleLogging) {
		logger.add(new transports.Console(consoleTransportOptions))
	}

	if (dataDogLogging && ddogApiKey) {
		logger.add(new transports.Http(httpTransportOptions(service)))
	}

	// create a stream object with a 'write' function that will be used by `morgan`
	logger.stream = {
		write: message => {
			// use the 'info' log level for loggin in both file and console transports
			logger.info(message)
		}
	}

	logger.debug({
		nodeEnv: logger.defaultMeta.env,
		consoleLogging,
		dataDogLogging,
		logsFolder
	})
	return logger
}

/**
 * Default Winston Instance for the application
 * Service name configured to application name
 */
export const winston = createWinstonLogger(serviceName)
