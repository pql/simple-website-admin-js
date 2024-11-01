import * as types from '@/shared/store/mutation-types';
import { TOKEN_KEY, USER_INFO_KEY, ROLES_KEY } from '@/shared/enums/cache';
import { getAuthCache, setAuthCache } from '@/shared/utils/auth';
import { router } from '@/shared/router/setupRouter';
import { PageEnum } from "@/shared/enums/page";
import { AbpApplicationConfigurationService } from '@/shared/api/services/AbpApplicationConfigurationService';
import { Mgr } from '@/shared/security/oidc';
import { error } from '@/shared/utils/log';
import { SET_AUTH_TOKEN, SET_SESSION_TIMEOUT } from '../mutation-types';
import jwtDecode from 'jwt-decode';

export default {
    namespaced: true,
    state: {
        // user info
        userInfo: null,
        // token
        token: undefined,
        // roleList
        roleList: [],
        // Whether the login expired
        sessionTimeout: false,
        // Last fetch time
        lastUpdateTime: 0,
    },
    getters: {
        getToken(state) {
            return state.token || getAuthCache(TOKEN_KEY)
        },
        getUserInfo(state) {
            return state.userInfo || getAuthCache(USER_INFO_KEY) || {};
        },
        getRoleList(state) {
            return state.roleList.length > 0 ? state.roleList : getAuthCache(ROLES_KEY);
        },
        getSessionTimeout(state) {
            return state.sessionTimeout;
        },
        getLastUpdateTime(state) {
            return state.lastUpdateTime;
        },
        checkUserLoginExpire(state) {
            try {
                const token = state.token;
                if(!token) return true;
                const decoded = jwtDecode(token);
                let currentTimeStamp = new Date().getTime() / 1000;
                if (currentTimeStamp >= decoded.exp) {
                  return true;
                } else {
                  return false;
                }
            } catch (error) {
                return true;
            }
        }
    },
    mutations: {
        [types.SET_AUTH_TOKEN](state, { token }) {
            state.token = token;
            setAuthCache(TOKEN_KEY, token);
        },
        [types.SET_ROLE_LIST](state, { roleList }) {
            state.roleList = roleList;
            setAuthCache(ROLES_KEY, roleList);
        },
        [types.SET_USER_INFO](state, { userInfo }) {
            state.userInfo = userInfo;
            setAuthCache(USER_INFO_KEY, userInfo);
        },
        [types.SET_LAST_UPDATE_TIME](state, { lastUpdateTime }) {
            state.lastUpdateTime = lastUpdateTime;
        },
        [types.SET_SESSION_TIMEOUT](state, { isSessionTimeout }) {
            state.sessionTimeout = isSessionTimeout
        }
    },
    actions: {
        [types.SET_USER_INFO](context, { userInfo: info }) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit } = context;

            // update last update time
            const lastUpdateTime = new Date().getTime();
            commit({
                type: `${types.SET_LAST_UPDATE_TIME}`,
                lastUpdateTime
            });

            // update user info
            const userInfo = { ...info };
            commit({
                type: `${types.SET_USER_INFO}`,
                userInfo
            });
        },
        /**
         * 登入
         * @param {object} user 
         */
        async [types.USER_LOGIN_ACTION](context, { user }) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit, dispatch } = context;
            const token = user.access_token;
            commit({
                type: `${types.SET_AUTH_TOKEN}`,
                token
            });

            const goHome = true;
            return dispatch({
                type: `${types.AFTER_LOGIN_ACTION}`,
                goHome
            });
        },
        /**
         * 登出
         * @param {boolean} goLogin
         */
        async [types.USER_LOGOUT_ACTION](context, { goLogin = false }) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit, getters, dispatch } = context;
            if(getters.getToken) {
                try {
                    await Mgr.signOut();
                    commit({
                        type: `${SET_AUTH_TOKEN}`,
                        token: undefined
                    });
                    commit({
                        type: `${SET_SESSION_TIMEOUT}`,
                        isSessionTimeout: false
                    });
                    dispatch({
                        type: `${types.SET_USER_INFO}`,
                        userInfo: null
                    });
                } catch (e) {
                    error('退出登录失败：', e);
                }
            } else {
                if(goLogin) {
                    // 直接回登录页
                    router.replace(PageEnum.BASE_LOGIN);
                } else {
                    // 回登录页带上当前路由地址
                    router.replace({
                        path: PageEnum.BASE_LOGIN,
                        query: {
                            redirect: encodeURIComponent(router.currentRoute.fullPath)
                        }
                    });
                }
            }

        },
        /**
         * @param {boolean} goHome 是否返回首页
         * @returns {Promise<Volo_Abp_AspNetCore_Mvc_ApplicationConfigurations_CurrentUserDto | null>}
         */
        async [types.AFTER_LOGIN_ACTION](context, { goHome }) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit, getters, dispatch } = context;
            if (!getters.getToken) return null;
            // get user info
            const userInfo = await dispatch({
                type: `${types.GET_USERINFO_ACTION}`
            });
            if (getters.getSessionTimeout) {
                const isSessionTimeout = false;
                commit({
                    type: `${types.SET_SESSION_TIMEOUT}`,
                    isSessionTimeout
                });
            } else {
                goHome && router.replace(PageEnum.BASE_HOME);
            }
            return userInfo;
        },
        /**
         * 获取用户信息
         * @return {Promise<Volo_Abp_AspNetCore_Mvc_ApplicationConfigurations_CurrentUserDto | null> }
         */
        async [types.GET_USERINFO_ACTION](context) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit, getters, rootGetters, dispatch } = context;
            if (!getters.getToken) return null;

            let currentUser = rootGetters['abp/getCurrentUser'];

            // 没有用户信息时，重新获取一次配置信息
            if(!currentUser.id) {
                const applicationConfiguration = await AbpApplicationConfigurationService.getApiAbpApplicationConfiguration({
                    includeLocalizationResources: false
                });
                commit({
                    type: `abp/${types.SET_ABP_APPLICATION_CONFIGURATION}`,
                    config: {
                        ...applicationConfiguration,
                    }
                });
                currentUser = applicationConfiguration.currentUser;
                commit({
                    type: `permission/${types.SET_PERM_CODE_LIST}`,
                    permCodeList: Object.keys(applicationConfiguration.auth.grantedPolicies || {})
                });
            }

            if(Array.isArray(currentUser.roles) && currentUser.roles.length > 0) {
                commit({
                    type: `${types.SET_ROLE_LIST}`,
                    roleList: currentUser.roles
                });
            } else {
                currentUser.roles = [];
                commit({
                    type: `${types.SET_ROLE_LIST}`,
                    roleList: currentUser.roles
                });
            }

            dispatch({
                type: `${types.SET_USER_INFO}`,
                userInfo: currentUser || null
            });

            return currentUser;

        },
        [types.RESET_USER_STATE](context) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit } = context;

            const userInfo = null;
            commit({
                type: `${types.SET_USER_INFO}`,
                userInfo
            });

            const token = '';
            commit({
                type: `${types.SET_AUTH_TOKEN}`,
                token
            });

            const roleList = [];
            commit({
                type: `${types.SET_ROLE_LIST}`,
                roleList
            });

            const isSessionTimeout = false;
            commit({
                type: `${types.SET_SESSION_TIMEOUT}`,
                isSessionTimeout
            });
        }
    }
}