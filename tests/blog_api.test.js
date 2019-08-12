const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const {
  equalTo, initialBlogs, blogsInDb, usersInDb,
} = require('./test_helper')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

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

    const created = blogsAtEnd.find(equalTo(newBlog))

    expect(created.likes).toBe(0)
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

describe('update a blog in bloglist', () => {
  test('succeeds with valid params', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToModify = blogsAtStart[0]

    const { likes } = blogToModify
    blogToModify.likes += 1

    await api
      .put(`/api/blogs/${blogToModify.id}`)
      .send(blogToModify)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    const blog = blogsAtEnd[0]
    expect(blog.likes).toBe(likes + 1)
  })
})

describe('When there is initially one user at userDb', () => {
  beforeEach(async () => {
    await User.remove({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})
