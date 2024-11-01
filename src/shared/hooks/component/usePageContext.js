
import { createContext, useContext } from '@/shared/hooks/core/useContext';

// export interface PageContextProps {
//   contentHeight: ComputedRef<number>;
//   pageHeight: Ref<number>;
//   setPageHeight: (height: number) => Promise<void>;
// }

const key = Symbol();

export function createPageContext(context) {
    return createContext(context, key, { native: true });
}

export function usePageContext() {
    return useContext(key);
}
