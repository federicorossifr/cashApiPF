const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // Where files should be sent once they are bundled
 entry: {
     accountDetails: "/src/AccountTransactionDetails.js",
     accountNavigation: "/src/AccountNavigation.js",
     transactionImporter:"/src/TransactionImporter.js",
     homeCharts:"/src/HomeCharts.js"

 },
 output: {
   path: path.join(__dirname, '/static/js'),
   filename: '[name].js'
 },
  // webpack 5 comes with devServer which loads in development mode
 devServer: {
   port: 3000,
   watchContentBase: true
 },
  // Rules of how webpack will take our files, complie & bundle them for the browser 
 module: {
   rules: [
     {
       test: /\.(js|jsx)$/,
       exclude: /nodeModules/,
       use: {
         loader: 'babel-loader'
       }
     },
     {
       test: /\.css$/,
       use: ['style-loader', 'css-loader']
     }
   ]
 }
}
