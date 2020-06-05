import {} from 'dotenv/config'
import { winston } from './util'
import app from './app'

const port = process.env.PORT || 3000
app.listen(port, () => {
	winston.info(`Server on http://localhost:${port}`)
})
