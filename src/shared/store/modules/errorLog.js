import * as types from '@/shared/store/mutation-types';
import { formatToDateTime } from '@/shared/utils/dateUtil';
import projectSetting from '@/shared/settings/projectSetting';
import { ERROR_TYPE } from '@/shared/enums/exception';

export default {
    namespaced: true,
    state: {
        errorLogInfoList: null,
        errorLogListCount: 0,
    },
    getters: {
        getErrorLogInfoList(state) {
            return state.errorLogInfoList || [];
        },
        getErrorLogListCount(state) {
            return state.errorLogListCount || 0;
        },
    },
    mutations: {
        [types.ADD_ERROR_LOG_INFO](state, { list }) {
            state.errorLogInfoList = list;
        },
        [types.SET_ERROR_LOG_LIST_COUNT](state, { count }) {
            state.errorLogListCount = count;
        }
    },
    actions: {
        [types.ADD_ERROR_LOG_INFO](context, { errInfo }) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit, state } = context;
            const item = {
                ...errInfo,
                time: formatToDateTime(new Date()),
            };
            commit({
                type: `${types.ADD_ERROR_LOG_INFO}`,
                list: [item, ...(state.errorLogInfoList || [])]
            });
            const count = state.errorLogListCount + 1;
            commit({
                type: `${types.SET_ERROR_LOG_LIST_COUNT}`,
                count: count
            });
        },
        [types.SET_ERROR_LOG_LIST_COUNT](context, { count }) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit } = context;
            commit({
                type: `${types.SET_ERROR_LOG_LIST_COUNT}`,
                count: count
            });
        },
        /**
         * @description Triggered after ajax request error
         * @param error
         * @returns
         */
        [types.ADD_AJAX_ERROR_INFO](context, payload) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { dispatch } = context;
            const { useErrorHandle } = projectSetting;
            const error = payload.errInfo;
            if (!useErrorHandle) {
                return false;
            }
            const errInfo = {
                type: ERROR_TYPE.AJAX,
                message: error.message
            };
            if (error.response) {
                const {
                    config: { url = '', data: params = '', method = 'get', headers = {} } = {},
                    data = {},
                } = error.response;
                errInfo.url = url;
                errInfo.name = 'Ajax Error!';
                errInfo.file = '-';
                errInfo.stack = JSON.stringify(data);
                errInfo.detail = JSON.stringify({ params, method, headers });
            }
            dispatch({
                type: `${types.ADD_ERROR_LOG_INFO}`,
                errInfo
            });
        }
    }
}