import { store } from '@/shared/store/setupStore';
import * as types from '@/shared/store/mutation-types';
import { computed } from 'vue';

export const useTransitionSetting = () => {

    const getTransitionSetting =  () => store.getters['app/getTransitionSetting'];

    const getEnableTransition = computed(() => getTransitionSetting().enable);

    const getOpenNProgress = computed(() => getTransitionSetting().openNProgress);

    const getOpenPageLoading = computed(() => !!getTransitionSetting().openPageLoading);

    const getBasicTransition = computed(() => getTransitionSetting().basicTransition);

    function setTransitionSetting(transitionSetting) {
        store.dispatch({
            type: `app/${types.SET_PROJECT_CONFIG}`,
            config: {
                transitionSetting
            }
        });
    }

    return {
        setTransitionSetting,

        getEnableTransition,
        getOpenNProgress,
        getOpenPageLoading,
        getBasicTransition
    }
}