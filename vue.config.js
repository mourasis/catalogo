module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy:  'http://api.hro.int/'
    
  },
  css: {
    loaderOptions: {
      css: {
        // options here will be passed to css-loader
      }
    }
  }
  /*
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/'
  ,publicPath: '/',
  css: {
    sourceMap: true,
    loaderOptions: {
      sass: {
        data: `@import "@/assets/css/fonts.scss";`
      }
    }
  },
  configureWebpack: {
    module: {
      rules: [{
        test: /\.(ttf|otf|eot|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]",
          },
        },
      }]
    }
  }*/
}
