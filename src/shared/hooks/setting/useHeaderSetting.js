import { store } from '@/shared/store/setupStore';
import * as types from '@/shared/store/mutation-types';
import { computed, unref } from 'vue';
import { useRootSetting } from '@/shared/hooks/setting/useRootSetting';
import { useMenuSetting } from '@/shared/hooks/setting/useMenuSetting';
import { useFullContent } from '@/shared/hooks/web/useFullContent';
import { MENU_MODE_ENUM } from '@/shared/enums/menu';

export function useHeaderSetting() {
    const { getShowLogo, getShowBreadCrumb } = useRootSetting();
    const {
        getMenuMode,
        getSplit,
        getShowHeaderTrigger,
        getIsSidebarType,
        getIsMixSidebar,
        getIsTopMenu,
    } = useMenuSetting();

    const { getFullContent } = useFullContent();

    const getUnFixedAndFull = computed(() => !unref(getFixed) && !unref(getShowFullHeaderRef));

    const getShowInsetHeaderRef = computed(() => {
        const need = !unref(getFullContent) && unref(getShowHeader);
        return (
            (need && !unref(getShowMixHeaderRef)) ||
            (need && unref(getIsTopMenu)) ||
            (need && unref(getIsMixSidebar))
        );
    });

    const getShowMixHeaderRef = computed(() => !unref(getIsSidebarType) && unref(getShowHeader));

    const getHeaderSetting = () => store.getters['app/getHeaderSetting'];

    const getShowDoc = computed(() => getHeaderSetting().showDoc);

    const getShowApi = computed(() => getHeaderSetting().showApi);

    const getHeaderTheme = computed(() => getHeaderSetting().theme);

    const getShowHeader = computed(() => getHeaderSetting().show);

    const getFixed = computed(() => getHeaderSetting().fixed);

    const getHeaderBgColor = computed(() => getHeaderSetting().bgColor);

    const getShowSearch = computed(() => getHeaderSetting().showSearch);

    const getUseLockPage = computed(() => getHeaderSetting().useLockPage);

    const getShowFullScreen = computed(() => getHeaderSetting().showFullScreen);

    const getShowNotice = computed(() => getHeaderSetting().showNotice);

    const getShowBread = computed(() => {
        return (
            unref(getMenuMode) !== MENU_MODE_ENUM.HORIZONTAL && unref(getShowBreadCrumb) && !unref(getSplit)
        );
    });

    const getShowHeaderLogo = computed(() => {
        return unref(getShowLogo) && !unref(getIsSidebarType) && !unref(getIsMixSidebar);
    });

    const getShowContent = computed(() => {
        return unref(getShowBread) || unref(getShowHeaderTrigger);
    });

    const getShowFullHeaderRef = computed(() => {
        return (
            !unref(getFullContent) &&
            unref(getShowMixHeaderRef) &&
            unref(getShowHeader) &&
            !unref(getIsTopMenu) &&
            !unref(getIsMixSidebar)
        )
    });

    /**
     * Set header configuration
     * @param {Partial<HeaderSetting>} headerSetting 
     */
    function setHeaderSetting(headerSetting) {
        store.dispatch({
            type: `app/${types.SET_PROJECT_CONFIG}`,
            config: {
                ...headerSetting
            }
        });
    }

    return {
        setHeaderSetting,

        getShowDoc,
        getShowApi,
        getShowSearch,
        getHeaderTheme,
        getUseLockPage,
        getShowFullScreen,
        getShowNotice,
        getShowBread,
        getShowContent,
        getShowHeaderLogo,
        getShowHeader,
        getFixed,
        getShowMixHeaderRef,
        getShowFullHeaderRef,
        getShowInsetHeaderRef,
        getUnFixedAndFull,
        getHeaderBgColor,
    }
}