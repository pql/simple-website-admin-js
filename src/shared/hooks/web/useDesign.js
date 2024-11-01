import { useAppProviderContext } from '@/shared/components/Application';

/**
 * for Vue3
 * @param {string} scope 
 */
export function useDesignVue3(scope) {
    const values = useAppProviderContext();
    return {
        prefixCls: `${values.prefixCls}-${scope}`,
        prefixVar: values.prefixCls,
    }
}

/**
 * for Vue2
 * @param {object} consumerRefs 消费者
 * @param {string} scope 
 */
export function useDesign(consumerRefs, scope) {
    const prefix = consumerRefs.prefixCls.default || 'vben';
    const prefixCls = `${prefix}-${scope}`

    return {
        prefixCls,
        prefixVar: consumerRefs.prefixCls
    }
}