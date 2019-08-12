const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 3,
    present: true,
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

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
