module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        },
        include: ['@babel/plugin-transform-class-properties']
      }
    ],

    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [['@babel/plugin-proposal-decorators', { version: '2023-11' }]]
};
