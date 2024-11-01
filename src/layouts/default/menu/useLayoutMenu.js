import { ref, unref, computed, watch } from 'vue';
import { router } from '@/shared/router/setupRouter';
import { MENU_SPLIT_TYPE_ENUM } from '@/shared/enums/menu';
import { useMenuSetting } from '@/shared/hooks/setting/useMenuSetting';
import { getChildrenMenus, getMenus, getShallowMenus, getCurrentParentPath } from '@/shared/router/menus'
import { store } from '@/shared/store/setupStore';
import { useThrottleFn } from '@vueuse/core';

export function useSplitMenu(splitType) {
    // Menu array
    const menusRef = ref([]);
    const { currentRoute } = router;

    const throttleHandleSplitLeftMenu = useThrottleFn(handleSplitLeftMenu, 50);

    const getMenuSetting = computed(() => useMenuSetting());

    const setMenuSetting = unref(getMenuSetting).setMenuSetting;

    const getIsHorizontal = computed(() => unref(getMenuSetting).getIsHorizontal);

    const getSplit = computed(() => unref(getMenuSetting).getSplit);

    const splitNotLeft = computed(() => unref(splitType) !== MENU_SPLIT_TYPE_ENUM.LEFT && !unref(getIsHorizontal));

    const getSplitLeft = computed(() => !unref(getSplit) || unref(splitType) !== MENU_SPLIT_TYPE_ENUM.LEFT);

    const getSplitTop = computed(() => unref(splitType) === MENU_SPLIT_TYPE_ENUM.TOP);

    const normalType = computed(() => unref(splitType) === MENU_SPLIT_TYPE_ENUM.NONE || !unref(getSplit));

    watch(
        [() => unref(currentRoute).path, () => unref(splitType)],
        /**
         * 
         * @param {string, MenuSplitTyeEnum} param0 
         */
        async ([path]) => {
            if (unref(splitNotLeft)) return;

            const { meta } = unref(currentRoute);
            const currentActiveMenu = meta.currentActiveMenu;
            let parentPath = await getCurrentParentPath(path);
            if (!parentPath) {
                parentPath = await getCurrentParentPath(currentActiveMenu);
            }
            parentPath && throttleHandleSplitLeftMenu(parentPath);
        },
        {
            immediate: true,
        }
    );

    // Menu changes
    watch(
        [() => store.getters['permission/getLastBuildMenuTime'], () => store.getters['permission/getBackMenuList']],
        () => {
            genMenus();
        },
        {
            immediate: true,
        }
    );

    // split Menu changes
    watch(
        () => getSplit.value,
        () => {
            if(unref(splitNotLeft)) return;
            genMenus();
        },
    );

    /**
     * Handle left menu split
     * @param {string} parentPath 
     */
    async function handleSplitLeftMenu(parentPath) {
        if (unref(getSplitLeft)) return;

        // split mode left
        const children = await getChildrenMenus(parentPath);

        if (!children || !children.length) {
            setMenuSetting({ hidden: true });
            menusRef.value = [];
            return;
        }

        setMenuSetting({ hidden: false });
        menusRef.value = children;
    }

    // get menus
    async function genMenus() {

        // normal mode
        if (unref(normalType)) {
            menusRef.value = await getMenus();
            return;
        }

        // split-top
        if (unref(getSplitTop)) {
            const shallowMenus = await getShallowMenus();
            menusRef.value = shallowMenus;
            return;
        }
    }

    return { menusRef };
}