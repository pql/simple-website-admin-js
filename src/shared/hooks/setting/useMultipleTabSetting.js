import { computed } from 'vue';
import { store } from '@/shared/store/setupStore';
import * as types from '@/shared/store/mutation-types';

export function useMultipleTabSetting() {

    const getMultiTabsSetting = () => store.getters['app/getMultiTabsSetting'];

    const getShowMultipleTab = computed(() => getMultiTabsSetting().show);

    const getShowQuick = computed(() => getMultiTabsSetting().showQuick);

    const getShowRedo = computed(() => getMultiTabsSetting().showRedo);

    const getShowFold = computed(() => getMultiTabsSetting().showFold);

    const getAutoCollapse = computed(() => getMultiTabsSetting().autoCollapse);

    /**
     * @param {Partial<MultiTabsSetting>} multiTabsSetting 
     */
    function setMultipleTabSetting(multiTabsSetting) {
        store.dispatch({
            type: `app/${types.SET_PROJECT_CONFIG}`,
            config: {
                multiTabsSetting
            }
        });
    }
    return {
        setMultipleTabSetting,

        getShowMultipleTab,
        getShowQuick,
        getShowRedo,
        getShowFold,
        getAutoCollapse,
    };
}
