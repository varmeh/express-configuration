import { Sequelize } from 'sequelize'
import { winston } from './winston.logger'

const { DB_NAME, DB_USER, DB_PWD, DB_HOST, DB_PORT, DB_SSL } = process.env

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PWD, {
	dialect: 'mysql',
	host: DB_HOST,
	port: DB_PORT,
	ssl: DB_SSL,
	pool: {
		max: 5,
		min: 1,
		acquire: 30000,
		idle: 10000
	},
	logging: msg => {
		if (process.env.NODE_ENV !== 'production') {
			winston.debug({ src: 'db', msg })
		}
	}
})

export { sequelize }
