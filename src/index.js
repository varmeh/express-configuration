import { winston } from './configuration'
import app from './app'

const port = process.env.PORT || 5000
app.listen(port, () => {
	winston.info(`Server on http://localhost:${port}`)
})
