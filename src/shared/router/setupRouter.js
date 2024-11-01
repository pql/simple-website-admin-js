// import router from '@/router';
import Router from 'vue-router';
import Vue from 'vue';
import { basicRoutes } from './routes';

// 白名单应该包含基本静态路由
const WHITE_NAME_LIST = [];
const getRouteNames = (array) => {
    array.forEach(item => {
        WHITE_NAME_LIST.push(item.name);
        getRouteNames(item.children || []);
    });
}
getRouteNames(basicRoutes);

export let router = null
// app router
// 创建一个可以被 Vue 应用程序使用的路由实例
export const createRouter = () => {
    if (router) return router;
    router = new Router({
        base: process.env.VUE_APP_PATH,
        mode: process.env.VUE_APP_MODE,
        // 应该添加到路由的初始路由列表
        routes: basicRoutes,
        scrollBehavior: () => ({ left: 0, top: 0 })
    });
    return router
}

// reset router
export function resetRouter() {
    // router.getRoutes().forEach((route) => {
    //     const { name } = route;
    //     if (name && !WHITE_NAME_LIST.includes(name)) {
    //         router.hasRoute(name) && router.removeRoute(name);
    //     }
    // });
    router.getRoutes().forEach((route, index) => {
        const { name } = route;
        if (name && !WHITE_NAME_LIST.includes(name)) {
            router.options.routes.splice(index, 1);
        }
    });
}

// config router
// 配置路由器
export const setupRouter = () => {
    // console.log(window.$website);
    Vue.use(Router);
    // 创建一个可以被 Vue 应用程序使用的路由实例
    return createRouter();
}

export default setupRouter;