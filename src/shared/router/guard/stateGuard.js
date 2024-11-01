import { PageEnum } from "@/shared/enums/page";
import { store } from '@/shared/store/setupStore';
import * as types from '@/shared/store/mutation-types';
import { noop } from "@/shared/utils";
import { removeTabChangeListener } from '@/shared/logics/mitt/routeChange';

const resetAppAllState = () => {
    store.dispatch({
        type: `app/${types.RESET_APP_ALL_STATE}`
    });
}

const resetPermissionState = () => {
    store.dispatch({
        type: `permission/${types.RESET_PERMISSION_STATE}`
    });
}

const resetMultipleTabState = noop;

const resetUserState = () => {
    store.dispatch({
        type: `user/${types.RESET_USER_STATE}`
    });
}

export function createStateGuard(router) {
    router.afterEach(to => {
        // Just enter the login page and clear the authentication information
        if(to.path === PageEnum.BASE_LOGIN) {
            resetAppAllState();
            resetPermissionState();
            resetMultipleTabState();
            resetUserState();
            removeTabChangeListener();
        }
    });
}