import { store } from '@/shared/store/setupStore';
import { PROJ_CFG_KEY } from '@/shared/enums/cache';
import projectSetting from '@/shared/settings/projectSetting';

import * as types from '@/shared/store/mutation-types';

import { Persistent } from '@/shared/utils/cache/persistent';
import { deepMerge } from '@/shared/utils';
import { getCommonStoragePrefix, getStorageShortName } from '@/shared/utils/env';

import { updateDarkTheme } from '@/shared/logics/theme/dark';

// Initial project configuration
export function initAppConfigStore() {
    let projCfg = Persistent.getLocal(PROJ_CFG_KEY);
    projCfg = deepMerge(projectSetting, projCfg || {});
    const darkMode = store.getters['app/getDarkMode'];

    // setting project configuration
    store.dispatch({
        type: `app/${types.SET_PROJECT_CONFIG}`,
        config: projCfg
    });

    // init dark mode
    updateDarkTheme(darkMode);

    // init store
    store.dispatch({
        type: `locale/${types.INIT_LOCALE}`
    });

    setTimeout(() => {
        clearObsoleteStorage();
    }, 16);
}

/**
 * As the version continues to iterate, there will be more and more cache keys stored in localStorage.
 * This method is used to delete useless keys
 */
export function clearObsoleteStorage() {
    const commonPrefix = getCommonStoragePrefix();
    const shortPrefix = getStorageShortName();

    [localStorage, sessionStorage].forEach((item) => {
        Object.keys(item).forEach((key) => {
            if (key && key.startsWith(commonPrefix) && !key.startsWith(shortPrefix)) {
                item.removeItem(key);
            }
        });
    });
}