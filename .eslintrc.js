module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'airbnb-base',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-shadow': ['error', { allow: ['state'] }],
    'max-len': ['error', { code: 120, ignoreStrings: true }],
    'prefer-destructuring': ['error', {
      array: false,
      object: true,
    }, {
      enforceForRenamedProperties: false,
    }],
    'class-methods-use-this': ['error', { enforceForClassFields: false }],
    'vue/first-attribute-linebreak': ['error', {
      singleline: 'ignore',
      multiline: 'ignore',
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 120,
      },
      multiline: {
        max: 120,
      },
    }],
  },
};
