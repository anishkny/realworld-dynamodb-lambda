module.exports = {

  env: {
    node: true,
    mocha: true,
    es6: true,
  },

  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },

  // The Rules (Keep them sorted)
  extends: 'eslint:recommended',
  rules: {
    'comma-spacing': 'error',
    'eol-last': 'error',
    'max-len': ['error', 80],
    'no-console': 'off',
    'no-multi-spaces': 'error',
    'no-trailing-spaces': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'require-atomic-updates': 'off',
    'semi': 'error',
    'space-before-function-paren': ['error', {
      'anonymous': 'always',
      'asyncArrow': 'always',
      'named': 'never',
    }],
  },

};
