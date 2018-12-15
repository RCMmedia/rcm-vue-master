let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your theme. By default, we are compiling the Sass file for the theme
 | as well as bundling up all the JS files.
 |
 */

mix.webpackConfig({
  output: {
    publicPath: '/rcm-vue-master/wp-content/themes/rcm-vue/dist/',
    chunkFilename: '[name].js',
},
  module: {
    loaders: [

      // this will apply to both plain `.js` files
      // AND `<script>` blocks in `.vue` files
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      // this will apply to both plain `.css` files
      // AND `<style>` blocks in `.vue` files
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader' // <-- this line
          }
        }
      }
    ]
  }
  
});
mix.setPublicPath('dist')
   .js('src/app.js', 'scripts/')
   .extract([
      'jquery',
      'axios',
      'hellojs',
      'babel-polyfill',
      'lodash',
      'tether',
      'vue'
   ])
   .sass('src/styles/app.scss', 'styles/')
   .copyDirectory('src/assets', 'dist/assets')
   .options({
      processCssUrls: false,
      uglify: true
    })
   .version();
   mix.setResourceRoot("http://localhost/rcm-vue-master/wp-content/themes/rcm-vue/dist/");


  