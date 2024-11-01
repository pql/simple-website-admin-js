
import { createContext, useContext } from '@/shared/hooks/core/useContext';

// export interface ContentContextProps {
//   contentHeight: ComputedRef<number>;
//   setPageHeight: (height: number) => Promise<void>;
// }

const key = Symbol();

export function createContentContext(context) {
  return createContext(context, key, { native: true });
}

export function useContentContext() {
  return useContext(key);
}
