import { cloneDeep, omit } from 'lodash';
import Router from 'vue-router';

/**
 * @description Convert multi-level routing to level 2 routing
 * @description 将多级路由转换为 2 级路由
 * @param {AppRouteModule[]} routeModules 
 * @returns 
 */
export function flatMultiLevelRoutes(routeModules) {
    const modules = cloneDeep(routeModules);

    for (let index = 0; index < modules.length; index++) {
        const routeModule = modules[index];
        // 判断级别是否 多级 路由
        if (!isMultipleRoute(routeModule)) {
            // 声明终止当前循环， 即跳过此次循环，进行下一轮
            continue;
        }
        // 路由等级提升
        promoteRouteLevel(routeModule);
    }
    return modules;
}

/**
 * @description Routing level upgrade
 * @description 路由等级提升
 * @param {AppRouteModule} routeModule 
 */
function promoteRouteLevel(routeModule) {
    console.log('promoteRouteLevel');
    // Use vue-router to splice menus
    // 使用vue-router拼接菜单
    // createRouter 创建一个可以被 Vue 应用程序使用的路由实例
    let router = new Router({
        base: process.env.VUE_APP_PATH,
        mode: process.env.VUE_APP_MODE,
        routes: [routeModule],
    });

    // getRoutes： 获取所有 路由记录的完整列表。
    const routes = router.getRoutes();
    // 将所有子路由添加到二级路由
    addToChildren(routes, routeModule.children || [], routeModule);
    router = null;

    // omit lodash的函数 对传入的item对象的children进行删除
    routeModule.children = routeModule.children.map((item) => omit(item, 'children'));
}

/**
 * @description Add all sub-routes to the secondary route
 * @description 将所有子路由添加到二级路由
 * @param {RouteRecordNormalized[]} routes 
 * @param {AppRouteRecordRaw[]} children 
 * @param {AppRouteModule} routeModule 
 */
function addToChildren(
    routes,
    children,
    routeModule,
) {
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        const route = routes.find((item) => item.name === child.name);
        if (!route) {
            continue;
        }
        routeModule.children = routeModule.children || [];
        if (!routeModule.children.find((item) => item.name === route.name)) {
            routeModule.children.push(route);
        }
        if (child.children.length) {
            addToChildren(routes, child.children, routeModule);
        }
    }
}

/**
 * @description Determine whether the level exceeds 2 levels
 * @description 判断级别是否超过2级
 * @param {AppRouteModule} routeModule 
 * @returns 
 */
function isMultipleRoute(routeModule) {
    // Reflect.has 与 in 操作符 相同, 用于检查一个对象(包括它原型链上)是否拥有某个属性
    if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children.length) {
        return false;
    }

    const children = routeModule.children;

    let flag = false;
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        if (child.children && child.children.length) {
            flag = true;
            break;
        }
    }
    return flag;
}