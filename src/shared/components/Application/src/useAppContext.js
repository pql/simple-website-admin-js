
import { createContext, useContext } from '@/shared/hooks/core/useContext';

const key = Symbol();


export function createAppProviderContext(context) {
    return createContext(context, key);
}

/**
 * interface AppProviderContextProps {
 *      prefixCls: Ref<string>;
 *      isMobile: Ref<boolean>;
 * }
 * useContext<AppProviderContextProps>(key);
 */
export function useAppProviderContext() {
    return useContext(key);
}