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
    'no-console': 0
  }
}