import { useDebounceFn, useTimeoutFn } from '@vueuse/core';
import { toRaw, unref, computed } from 'vue';
import { getAllParentPath } from '@/shared/router/helper/menuHelper';
import { uniq } from 'lodash';

export function useOpenKeys(
    menuState,
    menus,
    accordion,
    mixSider,
    collapse
) {
    const debounceSetOpenKeys = useDebounceFn(setOpenKeys, 50);

    /**
     * @param {string} path 
     */
    async function setOpenKeys(path) {
        const native = !mixSider.value;
        const menuList = toRaw(menus.value);

        const handle = () => {
            if (menuList && menuList.length === 0) {
                menuState.activeSubMenuNames = [];
                menuState.openNames = [];
                return;
            }
            const keys = getAllParentPath(menuList, path);

            if (!unref(accordion)) {
                menuState.openNames = uniq([...menuState.openNames, ...keys]);
            } else {
                menuState.openNames = keys;
            }
            menuState.activeSubMenuNames = menuState.openNames;
        };
        if (native) {
            handle();
        } else {
            useTimeoutFn(handle, 30);
        }
    }

    const getOpenKeys = computed(() => {
        return unref(collapse) ? [] : menuState.openNames;
    });

    return {
        setOpenKeys: debounceSetOpenKeys,
        getOpenKeys
    };
}