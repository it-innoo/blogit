const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { initialBlogs, blogsInDb } = require('./test_helper')

const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

afterAll(() => {
  mongoose.connection.close()
})

describe('when there is a bloglist', () => {
  test('All blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(initialBlogs.length)
  })

  test('identifier is named id', async () => {
    const response = await api.get('/api/blogs')

    const ids = response.body.map(r => r.id)
    expect(ids).toBeDefined()

    const oneBlog = response.body[0]
    expect(oneBlog.__v).toBeUndefined()
  })
})

describe('adding a new blog to bloglist', () => {
  it('increases the blog count', async () => {
    const newBlog = {
      author: 'Martin Fowler',
      title: 'Microservices Resource Guide',
      url: 'https://martinfowler.com/microservices/',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd.length)
      .toBe(initialBlogs.length + 1)

    const title = blogsAtEnd.map(r => r.title)
    expect(title)
      .toContain(
        'Microservices Resource Guide',
      )
  })

  it('likes get default value if not set', async () => {
    const newBlog = {
      author: 'Martin Fowler',
      title: 'Microservices Resource Guide',
      url: 'https://martinfowler.com/microservices/',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)

    const blogsAtEnd = await blogsInDb()

    const likes = blogsAtEnd
      .filter(r => r.title === newBlog.title)
      .map(r => r.likes)

    expect(likes[0]).toBe(0)
  })

  it('blog is not added without title', async () => {
    const newBlog = {
      author: 'Martin Fowler',
      url: 'https://martinfowler.com/microservices/',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd.length)
      .toBe(initialBlogs.length)
  })

  it('blog is not added without url', async () => {
    const newBlog = {
      author: 'Martin Fowler',
      title: 'Microservices Resource Guide',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd.length)
      .toBe(initialBlogs.length)
  })
})

describe('delete a blog from bloglist', () => {
  it('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd.length)
      .toBe(initialBlogs.length - 1)

    const title = blogsAtEnd.map(r => r.title)
    expect(title).not.toContain(blogToDelete.title)
  })

  it('fails with status code 400 if id is invalid', async () => {
    await api
      .delete('/api/blogs/1')
      .expect(400)
  })
})
