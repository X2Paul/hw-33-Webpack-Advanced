const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const { css } = require('jquery')
const TerserPlugin = require('terser-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin' )

const IS_DEV = process.env.NODE_ENV === 'development'
const IS_PROD = !IS_DEV

const optimization = () => {
  return {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [new CssMinimizerWebpackPlugin(), new TerserPlugin()]
  }
}

const filename = (ext) => (IS_DEV ? `[name].${ext}` : `[name].[fullhash].${ext}`)
const cssLoaders = (extra) => {
  const loaders = [{ loader: MiniCssExtractPlugin.loader }, 'css-loader']
  if (extra) {
    loaders.push(extra)
  }
  return loaders
}

pluginsSet = () => {
  return [
    new HTMLWebpackPlugin({ template: './index.html' }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'favicon.png'),
          to: path.resolve(__dirname, 'dist')
        }
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    }),
    new EslintWebpackPlugin({
      extensions: ['js'],
      fix: true
    })
  ]
}

jsLoaders = (extra) => {
  const loaders = {
      loader: "babel-loader",
      options: {
        presets: ['@babel/preset-env']
      }
    }

  if (extra) {
    loaders.options.presets.push(extra)
  }
  return loaders;
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: './index.jsx',
    stat: './statistics.ts'
  },

  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: filename('js')
  },

  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
  },

  optimization: optimization(),

  devServer: {
    hot: false,
    port: 4200,
  },

  devtool: IS_DEV ? 'source-map' : false,

  plugins: pluginsSet(),
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },

      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: jsLoaders('@babel/preset-typescript')
      },


      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: jsLoaders('@babel/preset-react')
      },
      {
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader')
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif|webp)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[contenthash][ext]'
        }
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[contenthash][ext]'
        },
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
      {
        test: /\.csv$/,
        use: ['csv-loader']
      }

    ]
  }
}


