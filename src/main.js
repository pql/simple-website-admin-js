import Vue from 'vue';
import '@/shared/design/index.less';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App.vue';
import run from './app-pre-bootstrap';
import setupStore from '@/shared/store/setupStore';
import setupI18n from '@/shared/locales/setupI18n';
import setupGlobDirectives from '@/shared/directives';
import { setupErrorHandle } from '@/shared/logics/errorHandle';
import { initAppConfigStore } from '@/shared/logics/initAppConfig';
import { setupRouter } from '@/shared/router/setupRouter';
import { setupRouterGuard } from '@/shared/router/guard';
import { initAbpApplicationConfiguration } from '@/shared/logics/initAbpApplicationConfig';
import { setupAntDesignVue } from '@/shared/antd/imports';
import { setupAvueConfig } from '@/shared/avue/setupAvueConfig';

// -------------------------- (注意*不要删除)用于演示项目原有路由 --------------------------
// import axios from 'axios';
// import router from './router.js';
// import {
//   registerConfig
// } from './index';
// registerConfig({
//   config: {
//     keys: 'U2FsdGVkX1/xwwqTGwCNbGISEw82wbNp36+2zwR/YUW4Amq7JveW82c0nzxy3qUFCRzd96pakLxVVfWlkxX//k8GhH2SenwJ+ENZ9xqTeSC+GjfM3PCi2hGhe9jpwiPa'
//   },
//   router,
//   axios
// });
// 注释下方代码 const router = setupRouter(); setupRouterGuard(router); 即可查看项目原有路由
// -------------------------- (注意*不要删除)用于演示项目原有路由 --------------------------

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(window.AVUE);

async function bootstrap() {

  // inject AntDesignVue component what we need
  // 按需注册ant-design-vue组件
  setupAntDesignVue();

  // Configure store
  // 配置 store
  const { store } = setupStore();

  // Initialize internal system configuration
  // 初始化内部系统配置
  initAppConfigStore();

  // Multilingual configuration
  // 多语言配置
  // Asynchronous case: language files may be obtained from the server side
  // 异步案例：语言文件可能从服务器端获取
  const { i18n } = await setupI18n();

  // Configure routing
  // 配置路由
  const router = setupRouter();

  // router-guard
  // 路由守卫
  setupRouterGuard(router);

  // Register global directive
  // 注册全局指令
  setupGlobDirectives();

  // Register @avue config
  setupAvueConfig();

  // Initialize abp application configuration
  // 初始化abp应用配置
  initAbpApplicationConfiguration();
  
  // Configure global error handling
  // 配置全局错误处理
  setupErrorHandle();
  
  const app = new Vue({
    store,
    i18n,
    // Route Configuration
    // 路由配置
    router,
    render: h => h(App)
  });

  app.$mount('#app');
}

run(bootstrap);