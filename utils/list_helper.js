// eslint-disable-next-line no-unused-vars
const dummy = blogs => 1

const byLikes = (a, b) => b.likes - a.likes

const totalLikes = blogs => blogs
  .map(blog => blog.likes)
  .reduce((total, amount) => total + amount, 0)


const favoriteBlog = (blogs) => {
  if (blogs === undefined || blogs === null || blogs.length === 0) {
    return {}
  }

  const { title, author, likes } = blogs.sort(byLikes)[0]

  return { title, author, likes }
}

const mostBlogs = (blogs) => {
  if (blogs === undefined || blogs === null || blogs.length === 0) {
    return null
  }

  const authors = blogs
    .map(b => b.author)
    .reduce((obj, name) => {
      const o = obj
      o[name] = o[name] ? (o[name] + 1) : 1
      return o
    }, {})

  const max = Object.entries(authors)
    .reduce((prev, current) => ((prev[1] > current[1])
      ? prev : current))

  return {
    author: max[0],
    blogs: max[1],
  }
}

const mostLikes = (blogs) => {
  if (blogs === undefined || blogs === null || blogs.length === 0) {
    return null
  }

  const authors = blogs
    .map(b => ({
      author: b.author,
      likes: b.likes,
    }))

  const likes = authors
    .reduce((obj, name) => {
      const o = obj
      o[name.author] = o[name.author]
        ? (o[name.author] + name.likes)
        : name.likes
      return o
    }, {})

  const max = Object.entries(likes)
    .reduce((prev, current) => ((prev[1] > current[1])
      ? prev : current))

  return {
    author: max[0],
    likes: max[1],
  }
}

module.exports = {
  dummy,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  totalLikes,
}
