import { useI18n } from '@/shared/hooks/web/useI18n';
import { SESSION_TIMEOUT_PROCESSING_ENUM } from '@/shared/enums/app';
import projectSetting from '@/shared/settings/projectSetting';
import * as types from '@/shared/store/mutation-types';
import { store } from '@/shared/store/setupStore';

// const { createMessage, createErrorModal } = useMessage();
// const error = createMessage.error!;
const stp = projectSetting.sessionTimeoutProcessing;

/**
 * 
 * @param {number} status 
 * @param {string} msg 
 * @param {ErrorMessageMode} errorMessageMode
 * @returns {void}
*/
export function checkStatus(status, msg, errorMessageMode = 'message') {
    const { l } = useI18n();
    // const userStore = UserStore.useStoreWithOut();
    let errMessage = '';

    switch (status) {
        case 400:
            errMessage = `${msg}`;
            break;
        // 401: Not logged in
        // Jump to the login page if not logged in, and carry the path of the current page
        // Return to the current page after successful login. This step needs to be operated on the login page.
        case 401:
            store.commit({
                type: `user/${types.SET_AUTH_TOKEN}`,
                token: undefined
            });
            // userStore.setToken(undefined);
            errMessage = msg || l('Unified.texts.sys:api:errMsg401');
            if (stp === SESSION_TIMEOUT_PROCESSING_ENUM.PAGE_COVERAGE) {
                store.commit({
                    type: `user/${types.SET_SESSION_TIMEOUT}`,
                    isSessionTimeout: true
                });
                // userStore.setSessionTimeout(true);
            } else {
                // 被动登出，带redirect地址
                const goLogin = true;
                store.dispatch({
                    type: `user/${types.USER_LOGOUT_ACTION}`,
                    goLogin
                });
                // userStore.logout(true);
            }
            break;
        case 403:
            errMessage = l('Unified.texts.sys:api:errMsg403');
            break;
        // 404请求不存在
        case 404:
            errMessage = l('Unified.texts.sys:api:errMsg404');
            break;
        case 405:
            errMessage = l('Unified.texts.sys:api:errMsg405');
            break;
        case 408:
            errMessage = l('Unified.texts.sys:api:errMsg408');
            break;
        case 500:
            errMessage = l('Unified.texts.sys:api:errMsg500');
            break;
        case 501:
            errMessage = l('Unified.texts.sys:api:errMsg501');
            break;
        case 502:
            errMessage = l('Unified.texts.sys:api:errMsg502');
            break;
        case 503:
            errMessage = l('Unified.texts.sys:api:errMsg503');
            break;
        case 504:
            errMessage = l('Unified.texts.sys:api:errMsg504');
            break;
        case 505:
            errMessage = l('Unified.texts.sys:api:errMsg505');
            break;
        default:
    }

    if (errMessage) {
        if (errorMessageMode === 'modal') {
            //   createErrorModal({ title: l('Unified.texts.sys:api:errorTip'), content: errMessage });
        } else if (errorMessageMode === 'message') {
            //   error({ content: errMessage, key: `global_error_message_status_${status}` });
        }
    }
}