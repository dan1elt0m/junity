const jestJupyterLab = require('@jupyterlab/testutils/lib/jest-config');

const esModules = [
  '@codemirror',
  '@jupyter/react-components',
  '@jupyter/web-components',
  '@jupyter/ydoc',
  '@jupyterlab/',
  '@microsoft/',
  'lib0',
  'nanoid',
  'vscode-ws-jsonrpc',
  'y-protocols',
  'y-websocket',
  'yjs',
  'exenv-es6'
].join('|');

const baseConfig = jestJupyterLab(__dirname);

module.exports = {
  ...baseConfig,
  automock: false,
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx)?$',
  transformIgnorePatterns: [`./node_modules/(?!${esModules}).+`],
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '^.+\\.css$': 'jest-css-modules-transform'
  },
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/src/__mocks__/svgMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironmentOptions: {
    customExportConditions: [''],
    testUrl: 'http://localhost'
  }
};
