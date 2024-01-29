/** @type {import('postcss-load-config').Config} */
const config = {
    plugins: [
      require('autoprefixer'),
      require('postcss-nested')
    ]
  }
  
  module.exports = config
  module.exports = {
    plugins: {
        'postcss-pxtorem': {
            rootValue: 36,
            minPixelValue: 2,
            propList: ['*'],
        }
    }
}
