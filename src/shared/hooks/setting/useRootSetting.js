import { store } from '@/shared/store/setupStore';
import * as types from '@/shared/store/mutation-types';
import { computed } from 'vue';
import { CONTENT_ENUM } from '@/shared/enums/app';

export const useRootSetting = () => {
    const getProjectSetting = () => store.getters['app/getProjectConfig'];

    const getPageLoading = computed(() => store.getters['app/getPageLoading']);

    const getOpenKeepAlive = computed(() => getProjectSetting().openKeepAlive);

    const getSettingButtonPosition = computed(() => getProjectSetting().settingButtonPosition);

    const getCanEmbedIFramePage = computed(() => getProjectSetting().canEmbedIFramePage);

    const getPermissionMode = computed(() => getProjectSetting().permissionMode);

    const getShowLogo = computed(() => getProjectSetting().showLogo);

    const getContentMode = computed(() => getProjectSetting().contentMode);

    const getUseOpenBackTop = computed(() => getProjectSetting().useOpenBackTop);

    const getShowSettingButton = computed(() => getProjectSetting().showSettingButton);

    const getUseErrorHandle = computed(() => getProjectSetting().useErrorHandle);

    const getShowFooter = computed(() => getProjectSetting().showFooter);

    const getShowBreadCrumb = computed(() => getProjectSetting().showBreadCrumb);

    const getThemeColor = computed(() => getProjectSetting().themeColor);

    const getShowBreadCrumbIcon = computed(() => getProjectSetting().showBreadCrumbIcon);

    const getFullContent = computed(() => getProjectSetting().fullContent);

    const getColorWeak = computed(() => getProjectSetting().colorWeak);

    const getGrayMode = computed(() => getProjectSetting().grayMode);

    const getLockTime = computed(() => getProjectSetting().lockTime);

    const getShowDarkModeToggle = computed(() => getProjectSetting().showDarkModeToggle);

    const getDarkMode = computed(() => store.getters['app/getDarkMode']);

    const getLayoutContentMode = computed(() =>
        getProjectSetting().contentMode === CONTENT_ENUM.FULL
            ? CONTENT_ENUM.FULL
            : CONTENT_ENUM.FIXED,
    );

    function setRootSetting(setting) {
        store.dispatch({
            type: `app/${types.SET_PROJECT_CONFIG}`,
            config: {
                ...setting
            }
        });
    }

    /**
     * 
     * @param {'dark' | 'light'} mode 
     */
    function setDarkMode(mode) {
        store.commit({
            type: `app${types.SET_DARK_MODE}`,
            mode: mode,
        });
    }

    return {
        setRootSetting,
        setDarkMode,

        getSettingButtonPosition,
        getFullContent,
        getColorWeak,
        getGrayMode,
        getLayoutContentMode,
        getPageLoading,
        getOpenKeepAlive,
        getCanEmbedIFramePage,
        getPermissionMode,
        getShowLogo,
        getUseErrorHandle,
        getShowBreadCrumb,
        getShowBreadCrumbIcon,
        getUseOpenBackTop,
        getShowSettingButton,
        getShowFooter,
        getContentMode,
        getLockTime,
        getThemeColor,
        getDarkMode,
        getShowDarkModeToggle,
    }
}