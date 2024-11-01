
import { PageEnum } from "@/shared/enums/page";
import { RootRoute } from "@/shared/router/routes";
import { store } from '@/shared/store/setupStore';
import { error } from '@/shared/utils/log';
import * as types from '@/shared/store/mutation-types';
import { PAGE_NOT_FOUND_ROUTE } from '@/shared/router/routes/basic';

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const ROOT_PATH = RootRoute.path;

const whitePathList = [LOGIN_PATH];

export function createPermissionGuard(router) {
    const userInfo = store.getters['user/getUserInfo'];

    router.beforeEach(async (to, from, next) => {
        if (
            from.path === ROOT_PATH &&
            to.path === PageEnum.BASE_HOME &&
            userInfo != null && userInfo.homePath && userInfo.homePath !== PageEnum.BASE_HOME
        ) {
            next(userInfo.homePath);
            return;
        }

        const token = store.getters['user/getToken'];
        const isSessionTimeout = store.getters['user/getSessionTimeout'];

        // Whitelist can be directly entered
        if (whitePathList.includes(to.path)) {
            // if (to.path === LOGIN_PATH && token) {
            //     try {
            //         const goHome = false;
            //         await store.dispatch({
            //             type: `user/${types.AFTER_LOGIN_ACTION}`,
            //             goHome
            //         });
            //         if (!isSessionTimeout) {
            //             next(decodeURIComponent(to.query && to.query.redirect || '/'));
            //         }
            //         return;
            //     } catch (e) {
            //         error(e);
            //     }
            // }
            next();
            return;
        }

        // You can access without permission. You need to set the routing meta.ignoreAuth to true
        if (to.meta.ignoreAuth) {
            next();
            return;
        }

        // token or user does not exist
        if (!token) {
            // redirect login page
            const redirectData = {
                path: LOGIN_PATH,
                replace: true
            };
            if (to.fullPath) {
                redirectData.query = {
                    ...redirectData.query,
                    redirect: to.fullPath
                };
            }
            next(redirectData);
            return;
        }

        const lastUpdateTime = store.getters['user/getLastUpdateTime'];
        // get userinfo while last fetch time is empty
        if (lastUpdateTime === 0) {
            try {
                await store.dispatch({
                    type: `user/${types.GET_USERINFO_ACTION}`
                });
            } catch (e) {
                next();
                return
            }
        }

        // console.log('getRoutes: ', router.getRoutes());

        // 动态路由加载（首次）
        // const isDynamicAddedRoute = store.getters['permission/getIsDynamicAddedRoute'];
        // if (!isDynamicAddedRoute) {
        //     const routes = await store.dispatch({
        //         type: `permission/${types.BUILD_ROUTES_ACTION}`
        //     });
        //     console.log('generated routes: ', routes);
        //     console.log('before getRoutes(): ', router.getRoutes());
        //     // 动态添加路由
        //     [...routes, PAGE_NOT_FOUND_ROUTE].forEach(route => {
        //         router.addRoute(route);
        //     });
        //     console.log('after getRoutes(): ', router.getRoutes());
        //     // 记录动态路由加载完成
        //     const added = true;
        //     store.commit({
        //         type: `permission/${types.SET_DYNAMIC_ADDED_ROUTE}`,
        //         added
        //     });

        //     // 现在的to动态路由加载之前的，可能为 PAGE_NOT_FOUND_ROUTE （例如，登陆后，刷新的时候）
        //     // 此处应当重定向到 fullPath, 否则会加载404页面内容
        //     next({ path: to.fullPath, replace: true, query: to.query });
        //     return;
        // }
        if(to.name === PAGE_NOT_FOUND_ROUTE.name) {
            // 遇到不存在页面，后续逻辑不再处理 redirect (阻止下面else逻辑)
            from.query.redirect = '';

            if(from.path === LOGIN_PATH && to.fullPath !== PageEnum.BASE_HOME) {
                // 登陆重定向不存在路由，转去“首页”
                next({ path: PageEnum.BASE_HOME, replace: true});
            } else {
                // 正常前往“404”页面
                next();
            }
        } else if(from.query.redirect) {
            // 存在redirect
            const redirect = decodeURIComponent(from.query.redirect || '');

            // 只处理一次 from.query.redirect
            // 也避免某场景（指向路由定义了 redirect）下的死循环
            from.query.redirect = '';

            if(redirect === to.fullPath) {
                // 已经被redirect
                next();
            } else {
                // 指向redirect
                next({ path: redirect, replace: true });
            }
        } else {
            // 正常访问
            next();
        }
    });
}