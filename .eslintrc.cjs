module.exports = {
  env: {
    browser: true,
    node: true,
    electron: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit',
    '@electron-toolkit/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  plugins: {
    prettier: {}
  },
  rules: {
    'react/jsx-sort-props': 'error',
    'space-infix-ops': 'error',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },
  overrides: [
    {
      rules: {
        'react/prop-types': 'off'
      }
    }
  ]
}
