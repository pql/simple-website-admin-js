const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: process.env.VUE_APP_PATH,
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'), // This line must in sass option
      },
      less: {
        implementation: require('less'),
        lessOptions: {
          javascriptEnabled: true, // 启用 JavaScript 支持 
          // ant-design-vue 自定义主题色配置： https://1x.antdv.com/docs/vue/customize-theme-cn/ 
          modifyVars: {
            // 最常用的通用变量
            'primary-color': '#1890ff', // 全局主色
            'link-color': '#1890ff', // 链接色
            'success-color': '#52c41a', // 成功色
            'warning-color': '#faad14', // 警告色
            'error-color': '#f5222d', // 错误色
            'font-size-base': '14px', // 主字号
            'heading-color': 'rgba(0, 0, 0, 0.85)', // 标题色
            'text-color': 'rgba(0, 0, 0, 0.65)', // 主文本色
            'text-color-secondary': 'rgba(0, 0, 0, 0.45)', // 次文本色
            'disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
            'border-radius-base': '4px', // 组件/浮层圆角
            'border-color-base': '#d9d9d9', // 边框色
            'box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)', // 浮层阴影
          }
        },
      }
    }
  },
  transpileDependencies: [
    'monaco-editor',
    '@jiaminghi/data-view'
  ],
  devServer: {
    port: 4300,
    // proxy: {
    //   '/api': {
    //     target: 'http://iot.huiteng.club/api/',
    //     ws: true,
    //     pathRewrite: {
    //       '^/api': '/'
    //     }
    //   },
    //   '/iot': {
    //     target: 'http://iot.huiteng.club/iot/',
    //     ws: true,
    //     pathRewrite: {
    //       '^/iot': '/'
    //     }
    //   }
    // }
  },
  configureWebpack: (config) => {
    Object.assign(config.resolve.alias, {
      // 大屏工程路径别名
      '@avue/avue-data': resolve('src'),
      '@': resolve('src'),
    })
  },
  chainWebpack: (config) => {
    //忽略的打包文件
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
    })
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      });
  }
}