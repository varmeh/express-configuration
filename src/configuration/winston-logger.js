/* eslint-disable no-shadow */
import os from 'os'
import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import dotenv from 'dotenv'
import { name as serviceName } from '../../package.json'

dotenv.config()
const { combine, timestamp, json, colorize, printf } = format

const logFormat = printf(
	({ level, timestamp, host, message }) =>
		`${level} - ${timestamp} - ${host} - ${JSON.stringify(message, null, 4)}`
)

const consoleFormat = printf(
	({ level, timestamp, message }) =>
		`${level} - ${timestamp} - ${JSON.stringify(message, null, 2)}`
)

const timestampFormat = timestamp({
	format: 'MM-DD-YYYY HH:mm:ss'
})

const consoleTransportOptions = {
	level: 'debug',
	format: combine(colorize(), timestampFormat, consoleFormat)
}

const fileTransportOptions = (service, logsfolder) => ({
	level: 'debug',
	filename: `${service}-%DATE%.log`,
	datePattern: 'YYYY-MM-DD',
	dirname: logsfolder,
	zippedArchive: true,
	maxSize: '100m',
	maxFiles: '15d',
	format: combine(timestampFormat, logFormat)
})

const httpTransportOptions = service => ({
	level: 'info',
	host: 'http-intake.logs.datadoghq.com',
	path: `/v1/input/${process.env.DD_API_KEY}?ddsource=nodejs&service=${service}`,
	ssl: true,
	format: combine(timestampFormat, logFormat, json())
})

export const createWinstonLogger = (
	service,
	{
		env = process.env.NODE_ENV || 'development',
		logsFolder = process.env.LOGS_FOLDER || 'logs',
		ddogApiKey = process.env.DD_API_KEY
	} = {}
) => {
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
			new DailyRotateFile(fileTransportOptions(service, logsFolder))
		]
	})

	if (ddogApiKey) {
		logger.add(new transports.Http(httpTransportOptions(service)))
	}

	// create a stream object with a 'write' function that will be used by `morgan`
	logger.stream = {
		write: message => {
			// use the 'info' log level so the output will be picked up by both transports (file and console)
			logger.info(message)
		}
	}

	logger.debug(`Environment: ${logger.defaultMeta.env}`)
	return logger
}

export const winston = createWinstonLogger(serviceName)
