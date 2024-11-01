import { store } from '@/shared/store/setupStore';
import * as types from '@/shared/store/mutation-types';
import { computed, unref, ref } from 'vue';
import { MENU_TYPE_ENUM, MENU_MODE_ENUM, TRIGGER_ENUM } from '@/shared/enums/menu';
import { SIDE_BAR_SHOW_TIT_MINI_WIDTH, SIDE_BAR_MINI_WIDTH } from '@/shared/enums/app';
import { useFullContent } from '@/shared/hooks/web/useFullContent';

const mixSideHasChildren = ref(false);

export function useMenuSetting() {
    const { getFullContent: fullContent } = useFullContent();

    const getMenuSetting = () => store.getters['app/getMenuSetting'];

    const getShowSidebar = computed(() => {
        return (
            unref(getSplit) ||
            (unref(getShowMenu) && unref(getMenuMode) !== MENU_MODE_ENUM.HORIZONTAL && !unref(fullContent))
        );
    });

    const getCollapsed = computed(() => getMenuSetting().collapsed);

    const getMenuType = computed(() => getMenuSetting().type);

    const getMenuMode = computed(() => getMenuSetting().mode);

    const getMenuFixed = computed(() => getMenuSetting().fixed);

    const getShowMenu = computed(() => getMenuSetting().show);

    const getMenuHidden = computed(() => getMenuSetting().hidden);

    const getMenuWidth = computed(() => getMenuSetting().menuWidth);

    const getTrigger = computed(() => getMenuSetting().trigger);

    const getMenuTheme = computed(() => getMenuSetting().theme);

    const getSplit = computed(() => getMenuSetting().split);

    const getMenuBgColor = computed(() => getMenuSetting().bgColor);

    const getMixSideTrigger = computed(() => getMenuSetting().mixSideTrigger);

    const getCanDrag = computed(() => getMenuSetting().canDrag);

    const getAccordion = computed(() => getMenuSetting().accordion);

    const getMixSideFixed = computed(() => getMenuSetting().mixSideFixed);

    const getTopMenuAlign = computed(() => getMenuSetting().topMenuAlign);

    const getCloseMixSidebarOnChange = computed(
        () => getMenuSetting().closeMixSidebarOnChange,
    );

    const getIsSidebarType = computed(() => unref(getMenuType) === MENU_TYPE_ENUM.SIDEBAR);

    const getIsTopMenu = computed(() => unref(getMenuType) === MENU_TYPE_ENUM.TOP_MENU);

    const getCollapsedShowTitle = computed(() => getMenuSetting().collapsedShowTitle);

    const getShowTopMenu = computed(() => {
        return unref(getMenuMode) === MENU_MODE_ENUM.HORIZONTAL || unref(getSplit);
    });

    const getShowHeaderTrigger = computed(() => {
        if (
            unref(getMenuType) === MENU_TYPE_ENUM.TOP_MENU ||
            !unref(getShowMenu) ||
            unref(getMenuHidden)
        ) {
            return false;
        }

        return unref(getTrigger) === TRIGGER_ENUM.HEADER;
    });

    const getIsHorizontal = computed(() => {
        return unref(getMenuMode) === MENU_MODE_ENUM.HORIZONTAL;
    });

    const getIsMixSidebar = computed(() => {
        return unref(getMenuType) === MENU_TYPE_ENUM.MIX_SIDEBAR;
    });

    const getIsMixMode = computed(() => {
        return unref(getMenuMode) === MENU_MODE_ENUM.INLINE && unref(getMenuType) === MENU_TYPE_ENUM.MIX;
    });

    const getRealWidth = computed(() => {
        if (unref(getIsMixSidebar)) {
            return unref(getCollapsed) && !unref(getMixSideFixed)
                ? unref(getMiniWidthNumber)
                : unref(getMenuWidth);
        }
        return unref(getCollapsed) ? unref(getMiniWidthNumber) : unref(getMenuWidth);
    });

    const getMiniWidthNumber = computed(() => {
        const { collapsedShowTitle, siderHidden } = getMenuSetting();
        return siderHidden
            ? 0
            : collapsedShowTitle
                ? SIDE_BAR_SHOW_TIT_MINI_WIDTH
                : SIDE_BAR_MINI_WIDTH;
    });

    const getCalcContentWidth = computed(() => {
        const width =
            unref(getIsTopMenu) || !unref(getShowMenu) || (unref(getSplit) && unref(getMenuHidden))
                ? 0
                : unref(getIsMixSidebar)
                    ? (unref(getCollapsed) ? SIDE_BAR_MINI_WIDTH : SIDE_BAR_SHOW_TIT_MINI_WIDTH) +
                    (unref(getMixSideFixed) && unref(mixSideHasChildren) ? unref(getRealWidth) : 0)
                    : unref(getRealWidth);

        return `calc(100% - ${unref(width)}px)`;
    });

    /**
     * Set menu configuration
     * @param {Partial<MenuSetting>} menuSetting 
     */
    function setMenuSetting(menuSetting) {
        store.commit({
            type: `app/${types.SET_MENU_SETTING}`,
            setting: {
                ...menuSetting
            }
        });
    }

    function toggleCollapsed() {
        setMenuSetting({
            collapsed: !unref(getCollapsed),
        });
    }

    return {
        setMenuSetting,
        toggleCollapsed,
        getMenuFixed,
        getRealWidth,
        getMenuType,
        getMenuMode,
        getShowMenu,
        getCollapsed,
        getMiniWidthNumber,
        getCalcContentWidth,
        getMenuWidth,
        getTrigger,
        getSplit,
        getMenuTheme,
        getCanDrag,
        getCollapsedShowTitle,
        getIsHorizontal,
        getIsSidebarType,
        getAccordion,
        getShowTopMenu,
        getShowHeaderTrigger,
        getTopMenuAlign,
        getMenuHidden,
        getIsTopMenu,
        getMenuBgColor,
        getShowSidebar,
        getIsMixMode,
        getIsMixSidebar,
        getCloseMixSidebarOnChange,
        getMixSideTrigger,
        getMixSideFixed,
        mixSideHasChildren,
    }
}