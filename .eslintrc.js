module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es6': true,
    "jest": true,
  },
  'extends': 'airbnb',
  'parserOptions': {
    'ecmaVersion': 2018
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    "no-underscore-dangle": ["error", { "allow": ["_id", "__v"] }],
    'no-console': 0
  }
}