const http = require('http')
const app = require('./app') // varsinainen Express-sovellus
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)
logger.info(`Environment un index.js: ${process.env.NODE_ENV}`)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
