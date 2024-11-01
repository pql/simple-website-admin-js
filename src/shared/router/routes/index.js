import { PageEnum } from '@/shared/enums/page';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '@/shared/router/routes/basic';
import { mainOutRoutes } from './mainOut';
import { genAttrs } from '@/shared/utils/gen-attrs';

/**
 * 直接引入当前“modules”目录下的所有的模块
 * directory（必填）：一个字符串，表示要搜索的目录的绝对路径或相对于当前文件的相对路径。
 * useSubdirectories（可选，默认为 false）：一个布尔值，表示是否还应该搜索子目录。
 * regExp（可选，默认为 /^\.\//）：一个正则表达式，用于匹配目录下的文件。
 */
const context = require.context('./modules', true, /\/*\.(js)$/);
// 获取 ./modules 路径下所有的 js 文件，将所有模块整合成到一起
const modules  = context.keys().reduce((acc, key) => {
    const module = context(key);
    acc[key] = module;
    return acc;
}, {});

const routeModuleList = [];
// 路由映射表
const routeMap = {
  ...genAttrs(modules, 'modules')
}
// 加入到路由集合中
Object.keys(routeMap).forEach(key => {
  const mod = routeMap[key] || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [
  // PAGE_NOT_FOUND_ROUTE,
  ...routeModuleList,
];

// 根路由
export const RootRoute = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

// 登录路由
export const LoginRoute = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/sys/login/OidcSignInCallback.vue'),
  meta: {
    title: 'Unified.texts.Login', // 多语言翻译字符
  },
}

// Basic routing without permission
// 未经许可的基本路由
export const basicRoutes = [
  LoginRoute,
  RootRoute,
  ...mainOutRoutes,
  REDIRECT_ROUTE,
  // PAGE_NOT_FOUND_ROUTE,
];
