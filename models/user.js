const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
  },
  name: String,
  passwordHash: String,
})

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    const o = returnedObject
    o.id = returnedObject._id
    delete o._id
    delete o.__v
    delete o.passwordHash
  },
})

// userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
