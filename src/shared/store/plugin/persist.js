
import createPersistedState from 'vuex-persistedstate';
import { getCommonStoragePrefix } from '@/shared/utils/env';

/**
 * Register Vuex Persist Plugin
 * @param optionState vuex Options<State>
 * 注册 vuex 持久化插件
 */
export function registerPersistPlugin() {
    const options = createPersistedStateOptions();
    return createPersistedState(options);
}

/**
 * Create Persisted State Options
 * 创建持久化状态选项
 * @param optionState vuex Options<State>
 * @returns persisted state factory options
 */
export function createPersistedStateOptions() {
    const keyPrefix = getCommonStoragePrefix()
    const key = 'vuex';
    return {
        storage: window.localStorage,
        key: `${keyPrefix}__${key}`,
    }
}