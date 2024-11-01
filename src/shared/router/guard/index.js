import { setRouteChange } from '@/shared/logics/mitt/routeChange';
import { store } from '@/shared/store/setupStore';
import * as types from '@/shared/store/mutation-types';
import { useTransitionSetting } from '@/shared/hooks/setting/useTransitionSetting';
import { createPermissionGuard } from './permissionGuard';
import { createParamMenuGuard } from './paramMenuGuard';
import { createStateGuard } from './stateGuard';
import NProgress from 'nprogress';
import projectSetting from '@/shared/settings/projectSetting';
import { AxiosCanceler } from '@/shared/utils/http/axios/axiosCanceler';
import { Modal, notification } from 'ant-design-vue';
import { warn } from '@/shared/utils/log';
import { unref } from 'vue';

// Don't change the order of creation
export function setupRouterGuard(router) {
    createPageGuard(router);
    // createPageLoadingGuard(router);  // 注释掉且不要删除，后续会用上
    createHttpGuard(router);
    createScrollGuard(router);
    createMessageGuard(router);
    createProgressGuard(router);
    createPermissionGuard(router);
    createParamMenuGuard(router); // must after createPermissionGuard (menu has been built.)
    createStateGuard(router);
}

/**
 * Hooks for handling page state
 */
function createPageGuard(router) {
    const loadedPageMap = new Map();

    router.beforeEach((to, from, next) => {
        // The page has already been loaded, it will be faster to open it again, you don't need to do loading and other processing
        to.meta.loaded = loadedPageMap.get(to.path);
        // Notify routing changes
        setRouteChange(to);

        next();
    });

    router.afterEach(to => {
        loadedPageMap.set(to.path, true);
    });
}

/**
 * Used to handle page loading status
 */
function createPageLoadingGuard(router) {
    // get user token
    const token = store.getters['user/getToken'];
    const { getOpenPageLoading } = useTransitionSetting();
    router.beforeEach((to, from, next) => {
        if (!token) {
            next();
        }
        if (to.meta.loaded) {
            next();
        }
        if (unref(getOpenPageLoading)) {
            const loading = true;
            store.dispatch({
                type: `app/${types.SET_PAGE_LOADING_ACTION}`,
                loading
            });
            next();
        }
        next();
    });

    router.afterEach(() => {
        if (unref(getOpenPageLoading)) {
            // TODO Looking for a better way
            // The timer simulates the loading time to prevent flashing too fast,
            setTimeout(() => {
                const loading = false;
                store.commit({
                    type: `app/${types.SET_PAGE_LOADING}`,
                    loading
                });
            }, 220);
        }
        return true;
    });
}

/**
 * The interface used to close the current page to complete the request when the route is switched
 * @param router
 */
function createHttpGuard(router) {
    const { removeAllHttpPending } = projectSetting;
    let axiosCanceler;
    if (removeAllHttpPending) {
        axiosCanceler = new AxiosCanceler();
    }
    router.beforeEach((to, from, next) => {
        // Switching the route will delete the previous request
        axiosCanceler && axiosCanceler.removeAllPending();
        next();
    });
}

/**
 * Routing switch back to the top
 */
function createScrollGuard(router) {
    const isHash = (href) => {
        return /^#/.test(href);
    }

    router.afterEach((to) => {
        // scroll top
        isHash(to.href) && document.querySelector(`app-layout-content`).scrollTo(0, 0);
        return true;
    });
}

/**
 * Used to close the message instance when the route is switched
 * @param router
 */
export function createMessageGuard(router) {
    const { closeMessageOnSwitch } = projectSetting;

    router.beforeEach((to, from, next) => {
        try {
            if (closeMessageOnSwitch) {
                Modal.destroyAll();
                notification.destroy();
            }
        } catch (error) {
            warn('message guard error:' + error);
        }
        next();
    });
}

/**
 * Used to create progress guard
 * @param router
 */
export function createProgressGuard(router) {
    const { getOpenNProgress } = useTransitionSetting();

    router.beforeEach((to, from, next) => {
        if(to.meta.loaded) {
            next();
        }
        unref(getOpenNProgress) && NProgress.start();
        next();
    });
    
    router.afterEach(() => {
        unref(getOpenNProgress) && NProgress.done();
        return true;
    });
}