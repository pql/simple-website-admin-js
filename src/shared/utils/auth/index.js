import { Persistent } from '@/shared/utils/cache/persistent';
import projectSetting from '@/shared/settings/projectSetting';
import { CACHE_TYPE_ENUM, TOKEN_KEY } from '@/shared/enums/cache';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CACHE_TYPE_ENUM.LOCAL;

export function getToken() {
    return getAuthCache(TOKEN_KEY);
}

/**
 * 
 * @param {string} key 
 * @returns 
 */
export function getAuthCache(key) {
    const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
    return fn(key)
}

export function setAuthCache(key, value) {
    const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
    return fn(key, value, true);
}

export function clearAuthCache(immediate = true) {
    const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
    return fn(immediate);
}
