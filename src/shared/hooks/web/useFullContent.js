import { computed, unref } from 'vue';
import { router } from '@/shared/router/setupRouter';
import { store } from '@/shared/store/setupStore';

/**
 * @description Full screen display content
 */
export const useFullContent = () => {
    const { currentRoute } = router;
    const getProjectSetting = () => store.getters['app/getProjectConfig'];

    // Whether to display the content in full screen without displaying the menu
    const getFullContent = computed(() => {
        // Query parameters, the full screen is displayed when the address bar has a full parameter
        const route = unref(currentRoute);
        const query = route.query;
        if (query && Reflect.has(query, '__full__')) {
            return true;
        }
        // Return to the configuration in the configuration file
        return getProjectSetting().fullContent;
    });

    return { getFullContent };
}