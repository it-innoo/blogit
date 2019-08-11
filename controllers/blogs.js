const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

router.post('/', async (request, response, next) => {
  const { body } = request

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })

  try {
    const savedBlog = await blog.save()
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
