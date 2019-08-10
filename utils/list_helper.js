// eslint-disable-next-line no-unused-vars
const dummy = blogs => 1

const byLikes = (a, b) => b.likes - a.likes
const byValue = (a, b) => b.value - a.value

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


module.exports = {
  dummy,
  favoriteBlog,
  totalLikes,
}
