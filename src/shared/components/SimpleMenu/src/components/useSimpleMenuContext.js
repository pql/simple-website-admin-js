import { createContext, useContext } from '@/shared/hooks/core/useContext';

// export type MenuEmitterEvents = {
//     'on-update-opened':
//     | (string | number)[]
//     | {
//         opend: boolean;
//         parent?: ComponentInternalInstance | null;
//         uidList: number[];
//     };
//     'on-menu-item-select': string | number;
//     'open-name-change': {
//         name: string | number;
//         opened: boolean;
//     };
//     'on-update-active-name:submenu': number[];
// };

// export interface SimpleRootMenuContextProps {
//     rootMenuEmitter: Emitter<MenuEmitterEvents>;
//     activeName: Ref<string | number>;
// }

const key = Symbol();

/**
 * @param {SimpleRootMenuContextProps} context 
 * @returns 
 */
export function createSimpleRootMenuContext(context) {
    return createContext(context, key, { readonly: false, native: true });
}

export function useSimpleRootMenuContext() {
    return useContext(key);
}