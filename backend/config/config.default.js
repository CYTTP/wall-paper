/* eslint valid-jsdoc: "off" */

'use strict'

const path = require('path')
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1696679108931_1614'
  //上传文件 配置
  config.multipart = {
    mode: 'file',
    whitelist: () => true
  }
  //文件上传路径
  config.UPLOAD_DIR = path.resolve(__dirname, '..', 'app/public/upload')
  //用户头像存储路径
  config.UPLOAD_AVATAR_DIR = path.resolve(__dirname, '..', 'app/public/avatar')

  // add your middleware config here
  config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  return {
    ...config,
    ...userConfig,
    security: { //关闭csrf
      csrf: {
        enable: false
      }
    },
    mysql: {
      // 单数据库信息配置
      client: {
        // host
        host: '127.0.0.1',
        // 端口号
        port: '3306',
        // 用户名
        user: '***', //自己数据库的用户名
        // 密码
        password: '***',//自己数据库的密码
        // 数据库名
        database: 'wall',
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    },
    jwt: {
      secret: '@cyttp!678'
    }
  }
}
