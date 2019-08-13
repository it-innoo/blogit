const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')

router.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users.map(u => u.toJSON()))
})

router.post('/', async (request, response, next) => {
  try {
    const { username, password, name } = request.body

    if (!password || password.length < 3) {
      return response.status(400).send({
        error: 'pasword minimum length 3',
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()

    return response.json(savedUser)
  } catch (exception) {
    return next(exception)
  }
})

module.exports = router
