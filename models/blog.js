const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    const o = returnedObject
    o.id = returnedObject._id
    delete o._id
    delete o.__v
  },
})

module.exports = mongoose.model('Blog', blogSchema)
