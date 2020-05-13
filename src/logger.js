const { createLogger, format, transports, config } = require('winston')
const { combine, timestamp, json, colorize, simple } = format

module.exports = (serviceName, env = 'Prod') =>
	createLogger({
		exitOnError: false,
		format: combine(
			timestamp({
				format: 'MM-DD-YYYY HH:mm:ss'
			}),
			json()
		),
		defaultMeta: { env, serviceName },
		transports: [
			new transports.Console({
				format: combine(colorize(), simple())
			})
		]
	})
