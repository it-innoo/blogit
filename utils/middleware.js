const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: `Not Found: ${request.url}` })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  return next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler,
}
