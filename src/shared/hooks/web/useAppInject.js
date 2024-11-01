import { useAppProviderContext } from '@/shared/components/Application';
import { computed, unref } from 'vue';

/**
 * for Vue3
 * @param {string} scope 
 */
export function useAppInjectVue3() {
    const values = useAppProviderContext();
    return {
        getIsMobile: computed(() => unref(values.isMobile)),
    }
}

/**
 * for Vue2
 */
export function useAppInject(consumerRefs) {
    return {
        getIsMobile: computed(() => unref(consumerRefs.isMobile)),
    }
}