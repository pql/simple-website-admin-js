
import { store } from '@/shared/store/setupStore';
import { PERMISSION_MODE_ENUM } from '@/shared/enums/app';
import { configureDynamicParamsMenu } from '@/shared/router/helper/menuHelper';

export function createParamMenuGuard(router) {
    router.beforeEach((to, from, next) => {
        // filter to name route
        if(!to.name) {
            next();
            return;
        }

        // menu has been built.
        // const isDynamicAddedRoute = store.getters['permission/getIsDynamicAddedRoute'];
        // if(!isDynamicAddedRoute) {
        //     next();
        //     return;
        // }

        let menus = [];
        if(isBackMode()) {
            menus = store.getters['permission/getBackMenuList'];
        } else if(isRouteMappingMode()) {
            menus = store.getters['permission/getFrontMenuList'];
        }

        menus.forEach(item => configureDynamicParamsMenu(item, to.params));

        next();
    });
}

const getPermissionMode = () => {
    const projectConfig = store.getters['app/getProjectConfig'];
    return projectConfig.permissionMode;
};

const isBackMode = () => {
    return getPermissionMode() === PERMISSION_MODE_ENUM.BACK;
};

const isRouteMappingMode = () => {
    return getPermissionMode() === PERMISSION_MODE_ENUM.ROUTE_MAPPING;
};