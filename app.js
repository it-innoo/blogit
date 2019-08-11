const express = require('express')

const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')


const app = express()
logger.info(`Environment un app.js: ${process.env.NODE_ENV}`)

app.use(cors())
app.use(bodyParser.json())

morgan
  .token('body', req => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

logger.info('connecting to', config.MONGODB_URI)

mongoose.set('useFindAndModify', false)
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then((result) => {
    logger.info('connected to MongoDB', result.connections[0].host)
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use('/api/blogs', blogsRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
