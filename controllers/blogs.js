const jwt = require('jsonwebtoken')
const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }

  return null
}

router.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

router.post('/', async (request, response, next) => {
  const { body } = request
  const token = getTokenFrom(request)

  try {
    const decodedToken = await jwt
      .verify(token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
      return response
        .status(401)
        .json({ error: 'token missing or invalid' })
        .end()
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
    })


    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(blog)
    await user.save()
    return response.status(201).json(savedBlog.toJSON())
  } catch (error) {
    return next(error)
  }
})

router.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    return response
      .status(204)
      .end()
  } catch (error) {
    return next(error)
  }
})

router.put('/:id', async (request, response, next) => {
  const {
    author, title, url, likes,
  } = request.body

  const blog = {
    author, title, url, likes,
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog.toJSON())
  } catch (error) {
    next(error)
  }
})

module.exports = router
