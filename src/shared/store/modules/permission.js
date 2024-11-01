
import * as types from '@/shared/store/mutation-types';
import { AUTH_KEY } from '@/shared/enums/cache';
import { getAuthCache, setAuthCache } from '@/shared/utils/auth';
import projectSetting from '@/shared/settings/projectSetting';
import { PERMISSION_MODE_ENUM } from '@/shared/enums/app';
import { asyncRoutes } from '@/shared/router/routes';
import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE } from '@/shared/router/routes/basic';
import { filter } from '@/shared/utils/helper/treeHelper';
import { transformRouteToMenu } from '@/shared/router/helper/menuHelper';
import { flatMultiLevelRoutes } from '@/shared/router/helper/routeHelper';
import { PageEnum } from "@/shared/enums/page";

export default {
    namespaced: true,
    state: {
        // 权限代码列表
        permCodeList: [],
        // Whether the route has been dynamically added
        // 路由是否动态添加
        isDynamicAddedRoute: false,
        // To trigger a menu update
        // 触发菜单更新
        lastBuildMenuTime: 0,
        // Backstage menu list
        // 后台菜单列表
        backMenuList: [],
        // menu List
        // 菜单列表
        frontMenuList: [],
    },
    getters: {
        getPermCodeList(state) {
            return state.permCodeList.length > 0
                ? state.permCodeList
                : getAuthCache(AUTH_KEY);
        },
        getIsDynamicAddedRoute(state) {
            return state.isDynamicAddedRoute;
        },
        getBackMenuList(state) {
            return state.backMenuList;
        },
        getLastBuildMenuTime(state) {
            return state.lastBuildMenuTime;
        },
        getFrontMenuList(state) {
            return state.frontMenuList;
        }
    },
    mutations: {
        [types.SET_PERM_CODE_LIST](state, { permCodeList }) {
            state.permCodeList = permCodeList;
            setAuthCache(AUTH_KEY, permCodeList);
        },
        [types.SET_DYNAMIC_ADDED_ROUTE](state, { added }) {
            state.isDynamicAddedRoute = added;
        },
        [types.SET_BACK_MENU_LIST](state, { list }) {
            state.backMenuList = list;
        },
        [types.SET_LAST_BUILD_MENU_TIME](state, { time = new Date().getTime() }) {
            state.lastBuildMenuTime = time;
        },
        [types.SET_FRONT_MENU_LIST](state, { list }) {
            state.frontMenuList = list;
        }
    },
    actions: {
        [types.SET_DYNAMIC_ADDED_ROUTE](context, { added }) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit } = context;
            commit({
                type: `${types.SET_DYNAMIC_ADDED_ROUTE}`,
                added: added
            });
        },
        // 构建路由
        async [types.BUILD_ROUTES_ACTION](context) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit, getters, rootGetters } = context;

            let routes = [];

            const roleList = rootGetters['user/getRoleList'];
            const permissionMode = rootGetters['app/getProjectConfig'].permissionMode || projectSetting.permissionMode;

            /**
             * 路由过滤器 在 函数filter 作为回调传入遍历使用
             * @param {AppRouteRecordRaw} route 
             * @returns 
             */
            const routeFilter = (route) => {
                const { meta } = route;
                // 抽出角色
                const { roles } = meta || {};
                if (!roles) return true;
                // 进行角色权限判断
                return roleList.some((role) => roles.includes(role));
            };

            /**
             * 
             * @param {AppRouteRecordRaw} route 
             * @returns 
             */
            const routeRemoveIgnoreFilter = (route) => {
                const { meta } = route;
                // ignoreRoute 为true 则路由仅用于菜单生成，不会在实际的路由表中出现
                const { ignoreRoute } = meta || {};
                // arr.filter 返回 true 表示该元素通过测试
                return !ignoreRoute;
            };


            /**
             * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
             * @param {AppRouteRecordRaw[]} routes 
             * @returns 
             */
            const patchHomeAffix = (routes) => {
                if (!routes || routes.length === 0) return;
                let homePath = PageEnum.BASE_HOME;

                function patcher(routes, parentPath = '') {
                    if (parentPath) parentPath = parentPath + '/';
                    routes.forEach((route) => {
                        const { path, children, redirect } = route;
                        const currentPath = path.startsWith('/') ? path : parentPath + path;
                        if (currentPath === homePath) {
                            if (redirect) {
                                homePath = route.redirect;
                            } else {
                                route.meta = Object.assign({}, route.meta, { affix: true });
                                throw new Error('end');
                            }
                        }
                        children && children.length > 0 && patcher(children, currentPath);
                    });
                }

                try {
                    patcher(routes);
                } catch (e) {
                    // 已处理完毕跳出循环
                }
                return;
            };

            switch (permissionMode) {
                // 角色权限
                case PERMISSION_MODE_ENUM.ROLE:
                    {
                        // 对非一级路由进行过滤
                        routes = filter(asyncRoutes, routeFilter);
                        // 对一级路由根据角色权限过滤
                        routes = routes.filter(routeFilter);
                        // Convert multi-level routing to level 2 routing
                        // 将多级路由转换为 2 级路由
                        routes = flatMultiLevelRoutes(routes);
                        break;
                    }
                // 路由映射，默认进入该 case
                case PERMISSION_MODE_ENUM.ROUTE_MAPPING:
                    {
                        const permissions = getters.getPermCodeList;
                        const roleRouteFilter = (route) => {
                            const { meta } = route;
                            const { policy } = meta || {};
                            if (!policy) return true;
                            //设置为true可获取全部菜单权限
                            return permissions == null || permissions == undefined || permissions.length == 0 ? false : permissions.includes(policy);
                        };

                        // 对非一级路由进行过滤
                        routes = filter(asyncRoutes, roleRouteFilter);
                        // 对一级路由再次根据角色权限过滤
                        routes = routes.filter(roleRouteFilter);
                        routes = routes.filter(
                            (e) => e.path.startsWith('/dashboard') || (e.children && e.children.length != 0),
                        );

                        // 将路由转换成菜单
                        const menuList = transformRouteToMenu(routes, true);
                        // 移除掉 ignoreRoute: true 的路由 非一级路由
                        routes = filter(routes, routeRemoveIgnoreFilter);
                        // 移除掉 ignoreRoute: true 的路由 一级路由；
                        routes = routes.filter(routeRemoveIgnoreFilter);
                        // 对菜单进行排序
                        menuList.sort((a, b) => {
                            return (a.meta.orderNo || 0) - (b.meta.orderNo || 0);
                        });
                        // 设置菜单列表
                        commit({
                            type: `${types.SET_FRONT_MENU_LIST}`,
                            list: menuList
                        });
                        // Convert multi-level routing to level 2 routing
                        // 将多级路由转换为 2 级路由
                        routes = flatMultiLevelRoutes(routes);
                        break;
                    }
                //  If you are sure that you do not need to do background dynamic permissions, please comment the entire judgment below
                //  如果确定不需要做后台动态权限，请在下方注释整个判断
                case PERMISSION_MODE_ENUM.BACK:
                    {
                        break;
                    }
            }
            routes.push(ERROR_LOG_ROUTE);
            patchHomeAffix(routes);

            return routes;
        },
        [types.SET_BACK_MENU_LIST](context, { list }) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit } = context;
            commit({
                type: `${types.SET_BACK_MENU_LIST}`,
                list: list
            });
            if (list.length > 0) {
                const time = new Date().getTime();
                commit({
                    type: `${types.SET_LAST_BUILD_MENU_TIME}`,
                    time
                });
            }
        },
        [types.RESET_PERMISSION_STATE](context) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit } = context;

            const added = false;
            commit({
                type: `${types.SET_DYNAMIC_ADDED_ROUTE}`,
                added
            });

            const permCodeList = [];
            commit({
                type: `${types.SET_PERM_CODE_LIST}`,
                permCodeList
            });

            const list = [];
            commit({
                type: `${types.SET_BACK_MENU_LIST}`,
                list
            });

            const time = 0;
            commit({
                type: `${types.SET_LAST_BUILD_MENU_TIME}`,
                time
            });
        }
    }
}