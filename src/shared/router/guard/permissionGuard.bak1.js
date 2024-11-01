
import { PageEnum } from "@/shared/enums/page";
import { RootRoute } from "@/shared/router/routes";
import { store } from '@/shared/store/setupStore';
import * as types from '@/shared/store/mutation-types';
import { PAGE_NOT_FOUND_ROUTE } from '@/shared/router/routes/basic';
import { PAGE_NOT_FOUND_NAME } from '@/shared/router/routes/constant';


const LOGIN_PATH = PageEnum.BASE_LOGIN;

const ROOT_PATH = RootRoute.path;

const whitePathList = [LOGIN_PATH];

export function createPermissionGuard(router) {
    const userInfo = store.getters['user/getUserInfo'];

    router.beforeEach(async (to, from, next) => {
        if (
            from.path === ROOT_PATH &&
            to.path === PageEnum.BASE_HOME &&
            userInfo && userInfo.homePath && userInfo.homePath !== PageEnum.BASE_HOME
        ) {
            next(userInfo.homePath);
            return;
        }

        const token = store.getters['user/getToken'];

        // Whitelist can be directly entered
        if (whitePathList.includes(to.path)) {
            next();
            return;
        }

        // You can access without permission. You need to set the routing meta.ignoreAuth to true
        if (to.meta.ignoreAuth) {
            next();
            return;
        }

        // token or user does not exist
        // if (token) {
        //     const checkUserLoginExpire = store.getters['user/checkUserLoginExpire'];
        //     if (checkUserLoginExpire) {
        //         router.replace(LOGIN_PATH);
        //         return;
        //     }
        // } else {
        //     next({
        //         path: LOGIN_PATH
        //     });
        //     //router.replace(PageEnum.BASE_LOGIN);
        //     return;
        // }

        // Jump to the 404 page after processing the login
        if (
            from.path === LOGIN_PATH &&
            to.name === PAGE_NOT_FOUND_ROUTE.name &&
            to.fullPath !== (userInfo.homePath || PageEnum.BASE_HOME)
        ) {
            next(userInfo.homePath || PageEnum.BASE_HOME);
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

        // const isDynamicAddedRoute = store.getters['permission/getIsDynamicAddedRoute'];
        // if (isDynamicAddedRoute) {
        //     next();
        //     return;
        // }

        // const routes = await store.dispatch({
        //     type: `permission/${types.BUILD_ROUTES_ACTION}`
        // });

        // console.log('before getRoutes: ', router.getRoutes());
        // [...routes, PAGE_NOT_FOUND_ROUTE].forEach(route => {
        //     router.addRoute(route);
        // });
        // console.log('after getRoutes: ', router.getRoutes());

        // // 记录动态路由加载完成
        // const added = true;
        // store.commit({
        //     type: `permission/${types.SET_DYNAMIC_ADDED_ROUTE}`,
        //     added
        // });

        if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
            // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
            next({ path: to.fullPath, replace: true, query: to.query });
        } else {
            const redirectPath = (from.query.redirect || to.path);
            const redirect = decodeURIComponent(redirectPath);
            const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
            next(nextData);
        }
    });
}