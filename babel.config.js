module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo', 'nativewind/babel'], // обратите внимание на порядок
    plugins: [
      // Если есть другие плагины, не удаляйте их!
      [
        '@babel/plugin-transform-react-jsx',
        {
          runtime: 'automatic',
          importSource: 'nativewind',
        },
      ],
    ],
  }
}
