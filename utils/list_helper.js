// eslint-disable-next-line no-unused-vars
const dummy = blogs => 1


const totalLikes = blogs => blogs
  .map(blog => blog.likes)
  .reduce((total, amount) => total + amount, 0)

module.exports = {
  dummy,
  totalLikes,
}
