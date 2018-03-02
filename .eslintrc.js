module.exports = {
  extends: ['eslint:recommended', 'google'],
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  rules: {
    'require-jsdoc': 0,
    'valid-jsdoc': 0,
    'no-console': 0,
  },
  overrides: [
    {
      files: ['src/**/*.js'],
      env: {
        browser: true,
      }
    },
    {
      files: [
        'src/service-worker.js',
      ],
      env: {
        serviceWorker: true,
      },
      globals: {
        workbox: true,
      },
    },
  ],
};
