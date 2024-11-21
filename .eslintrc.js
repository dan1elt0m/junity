module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  globals: {
    fetch: 'readonly'
  }
};
