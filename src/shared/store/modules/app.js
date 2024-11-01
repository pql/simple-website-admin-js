import { Persistent } from '@/shared/utils/cache/persistent';
import { PROJ_CFG_KEY, APP_DARK_MODE_KEY } from '@/shared/enums/cache';
import { deepMerge } from '@/shared/utils';
import * as types from '@/shared/store/mutation-types';
import { resetRouter } from '@/shared/router/setupRouter';
import { darkMode } from '@/shared/settings/designSetting';

let timeId;

export default {
    namespaced: true,
    state: {
        darkMode: undefined,
        pageLoading: false,
        projectConfig: Persistent.getLocal(PROJ_CFG_KEY),
        beforeMiniInfo: {},
    },
    getters: {
        getDarkMode(state) {
            return state.darkMode || localStorage.getItem(APP_DARK_MODE_KEY) || darkMode;
        },
        getPageLoading(state) {
            return state.pageLoading
        },
        getProjectConfig(state) {
            return state.projectConfig || {};
        },
        getTransitionSetting(state) {
            return state.projectConfig.transitionSetting;
        },
        getMultiTabsSetting(state) {
            return state.projectConfig.multiTabsSetting;
        },
        getHeaderSetting(state) {
            return state.projectConfig.headerSetting;
        },
        getMenuSetting(state) {
            return state.projectConfig.menuSetting;
        },
        getBeforeMiniInfo(state) {
            return state.beforeMiniInfo;
        }
    },
    mutations: {
        [types.SET_DARK_MODE](state, { mode }) {
            state.darkMode = mode;
            localStorage.setItem(APP_DARK_MODE_KEY, mode);
        },
        [types.SET_PROJECT_CONFIG](state, { config }) {
            state.projectConfig = config;
            Persistent.setLocal(PROJ_CFG_KEY, state.projectConfig);
        },
        [types.SET_PAGE_LOADING](state, { loading }) {
            state.pageLoading = loading;
        },
        [types.SET_MENU_SETTING](state, { setting }) {
            state.projectConfig.menuSetting = deepMerge(state.projectConfig.menuSetting, setting);
            Persistent.setLocal(PROJ_CFG_KEY, state.projectConfig);
        },
        [types.SET_BEFORE_MINI_INFO](state, { info }) {
            state.beforeMiniInfo = info;
        }
    },
    actions: {
        [types.SET_PROJECT_CONFIG](context, { config }) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit, state } = context;
            const projectConfig = deepMerge(state.projectConfig || {}, config);
            commit({
                type: `${types.SET_PROJECT_CONFIG}`,
                config: projectConfig
            });
        },
        [types.SET_PAGE_LOADING](context, { loading }) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit } = context;
            commit({
                type: `${types.SET_PAGE_LOADING}`,
                loading
            });
        },
        [types.SET_PAGE_LOADING_ACTION](context, { loading }) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit } = context;
            if(loading) {
                clearTimeout(timeId);
                // Prevent flicker
                timeId = setTimeout(() => {
                    commit({
                        type: `${types.SET_PAGE_LOADING}`,
                        loading: loading,
                    });
                }, 50);
            } else {
                commit({
                    type: `${types.SET_PAGE_LOADING}`,
                    loading: loading,
                });
                clearTimeout(timeId);
            }
        },
        [types.RESET_APP_ALL_STATE]() {
            resetRouter();
            Persistent.clearAll();
        }
    }
}