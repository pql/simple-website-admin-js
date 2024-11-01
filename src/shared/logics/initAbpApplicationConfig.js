
import { store } from '@/shared/store/setupStore';
import * as types from '@/shared/store/mutation-types';
import { router } from '@/shared/router/setupRouter';
import { PAGE_NOT_FOUND_ROUTE } from '@/shared/router/routes/basic';

export async function initAbpApplicationConfiguration() {
    // init abp application configuration
    await store.dispatch({
        type: `abp/${types.INIT_ABP_APPLICATION_CONFIGURATION}`
    });

    // build routes by abp application configuration auth grantedPolicies
    const routeList = await store.dispatch({
        type: `permission/${types.BUILD_ROUTES_ACTION}`
    });

    if (router) {
        if (router.getRoutes) {
            console.log('router add before getRoutes: ', router.getRoutes());
        }
        const routes = [...routeList, PAGE_NOT_FOUND_ROUTE];
        if (router.addRoute) {
            routes.forEach(route => {
                router.addRoute(route);
            });
        } else {
            router.addRoutes(routes);
        }
        if (router.getRoutes) {
            console.log('router added getRoutes: ', router.getRoutes());
        }
    }
}