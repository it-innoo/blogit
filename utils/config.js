require('dotenv').config()

const { PORT } = process.env
let { MONGODB_URI } = process.env

if (process.env.NODE_ENV !== 'production') {
  MONGODB_URI = process.env.MONGODB_TEST_URI
}

module.exports = {
  MONGODB_URI,
  PORT,
}
