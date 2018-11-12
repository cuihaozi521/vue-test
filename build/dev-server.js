require('./check-versions')() // 检查 Node 和 npm 版本
var autoRouter=require('./auto-router');
autoRouter.run(true);
var config = require('../config') // 获取 config/index.js 的默认配置
/*
 ** 如果 Node 的环境无法判断当前是 dev / product 环境
 ** 使用 config.dev.env.NODE_ENV 作为当前的环境
 */
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')   // 一个可以强制打开浏览器并跳转到指定 url 的插件
var path = require('path') // 使用 NodeJS 自带的文件路径工具
var express = require('express')  //引入exparess
var webpack = require('webpack')  //引入webpack
var proxyMiddleware = require('http-proxy-middleware')  //引入http-proxy-middleware - 代理
var webpackConfig = process.env.NODE_ENV === 'testing'  // 使用 prod or dev 环境的 webpack 配置
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
/* 如果没有指定运行端口，使用 config.dev.port 作为运行端口 */
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
//自动打开浏览器配置
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable  //使用 config.dev.proxyTable 的配置作为 proxyTable 的代理配置
var app = express()                     //使用 express 启动一个服务
var compiler = webpack(webpackConfig)   // 启动 webpack 进行编译

var devMiddleware = require('webpack-dev-middleware')(compiler, { //将编译后的文件暂存到内存中
  publicPath: webpackConfig.output.publicPath,
  quiet: false,
  stats:{
    colors:true
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {  //热加载
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) { //
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
// 将 proxyTable 中的请求配置挂在到启动的 express 服务上
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
// 使用 connect-history-api-fallback 匹配资源，如果不匹配就可以重定向到指定地址
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
// 将暂存到内存中的 webpack 编译后的文件挂在到 express 服务上
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
// 将 Hot-reload 挂在到 express 服务上
app.use(hotMiddleware)

// serve pure static assets
// 拼接 static 文件夹的静态资源路径
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
// 为静态资源提供响应服务
app.use(staticPath, express.static('./static'))

//启动服务自动打开浏览器跳转指定网页
var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}