
import { store } from '@/shared/store/setupStore';
import { PERMISSION_MODE_ENUM } from '@/shared/enums/app';
import { genAttrs } from '@/shared/utils/gen-attrs';
import { transformMenuModule, getAllParentPath } from '@/shared/router/helper/menuHelper';
import { router } from '@/shared/router/setupRouter';
import { filter } from '@/shared/utils/helper/treeHelper';
import { isHttpUrl } from '@/shared/utils/is';
import { pathToRegexp } from 'path-to-regexp';

/**
 * 直接引入当前“modules”目录下的所有的模块
 * directory（必填）：一个字符串，表示要搜索的目录的绝对路径或相对于当前文件的相对路径。
 * useSubdirectories（可选，默认为 false）：一个布尔值，表示是否还应该搜索子目录。
 * regExp（可选，默认为 /^\.\//）：一个正则表达式，用于匹配目录下的文件。
 */
const context = require.context('../routes/modules', true, /\/*\.(js)$/);
// 获取 ../routes/modules 路径下所有的 js 文件，将所有模块整合成到一起
const modules = context.keys().reduce((acc, key) => {
    const module = context(key);
    acc[key] = module;
    return acc;
}, {});

const routeModuleList = [];
// 路由映射表
const routeMap = {
    ...genAttrs(modules, 'modules')
}
// 加入到路由集合中
Object.keys(routeMap).forEach(key => {
    const mod = routeMap[key] || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    routeModuleList.push(...modList);
});


// ===========================
// ==========Helper===========
// ===========================

const getPermissionMode = () => {
    const projectSetting = store.getters['app/getProjectConfig'];
    return projectSetting.permissionMode;
};

const isBackMode = () => {
    return getPermissionMode() === PERMISSION_MODE_ENUM.BACK;
};

const isRouteMappingMode = () => {
    return getPermissionMode() === PERMISSION_MODE_ENUM.ROUTE_MAPPING;
};

const isRoleMode = () => {
    return getPermissionMode() === PERMISSION_MODE_ENUM.ROLE;
};

const staticMenus = [];
(() => {
    routeModuleList.sort((a, b) => {
        return (a.orderNo || 0) - (b.orderNo || 0);
    });

    for (const menu of routeModuleList) {
        staticMenus.push(transformMenuModule(menu));
    }
})();

console.log('staticMenus', staticMenus);

async function getAsyncMenus() {
    // 递归过滤所有隐藏的菜单
    const menuFilter = (items) => {
        return items.filter((item) => {
            const show = !(item.meta && item.meta.hideMenu) && !item.hideMenu;
            if (show && item.children) {
                item.children = menuFilter(item.children);
            }
            return show;
        });
    };
    if (isBackMode()) {
        const backMenuList = store.getters['permission/getBackMenuList'];
        return menuFilter(backMenuList);
    }
    if (isRouteMappingMode()) {
        const frontMenuList = store.getters['permission/getFrontMenuList'];
        return menuFilter(frontMenuList);
    }
    return staticMenus;
}

export const getMenus = async () => {
    const menus = await getAsyncMenus();
    if (isRoleMode()) {
        const routes = router.getRoutes();
        return filter(menus, basicFilter(routes));
    }
    return menus;
}

/**
 * 
 * @param {string} currentPath 
 */
export async function getCurrentParentPath(currentPath) {
    const menus = await getAsyncMenus();
    const allParentPath = await getAllParentPath(menus, currentPath);
    if (allParentPath && allParentPath.length > 0) {
        return allParentPath[0];
    }
    return undefined;
}

/**
 * Get the level 1 menu, delete children
 * @returns {Promise<Menu[]>}
 */
export async function getShallowMenus() {
    const menus = await getAsyncMenus();
    const shallowMenuList = menus.map((item) => ({ ...item, children: undefined }));
    if (isRoleMode()) {
        const routes = router.getRoutes();
        return shallowMenuList.filter(basicFilter(routes));
    }
    return shallowMenuList;
}

/**
 * Get the children of the menu
 * @param {string} parentPath 
 */
export async function getChildrenMenus(parentPath) {
    const menus = await getMenus();
    const parent = menus.find((item) => item.path === parentPath);
    if (!parent || !parent.children || parent && parent.meta && 'hideChildrenInMenu' in parent.meta) {
        return [];
    }
    if (isRoleMode()) {
        const routes = router.getRoutes();
        return filter(parent.children, basicFilter(routes));
    }
    return parent.children;
}

function basicFilter(routes) {
    return (menu) => {
        const matchRoute = routes.find((route) => {
            if (isHttpUrl(menu.path)) return true;

            if (route.meta.carryParam) {
                return pathToRegexp(route.path).test(menu.path);
            }
            const isSame = route.path === menu.path;
            if (!isSame) return false;

            if (route.meta.ignoreAuth) return true;

            return isSame || pathToRegexp(route.path).test(menu.path);
        });

        if (!matchRoute) return false;
        menu.icon = (menu.icon || matchRoute.meta.icon);
        menu.meta = matchRoute.meta;
        return true;
    };
}
