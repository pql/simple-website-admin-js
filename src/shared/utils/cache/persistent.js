import { DEFAULT_CACHE_TIME } from '@/shared/settings/encryptionSetting';
import { APP_LOCAL_CACHE_KEY, APP_SESSION_CACHE_KEY, LOCK_INFO_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/shared/enums/cache';
import { Memory } from './memory';
import { createLocalStorage, createSessionStorage } from '@/shared/utils/cache';
import { pick, omit } from 'lodash';

const ls = createLocalStorage();
const ss = createSessionStorage();

const localMemory = new Memory(DEFAULT_CACHE_TIME);
const sessionMemory = new Memory(DEFAULT_CACHE_TIME);

function initPersistentMemory() {
    const localCache = ls.get(APP_LOCAL_CACHE_KEY);
    const sessionCache = ss.get(APP_SESSION_CACHE_KEY);
    localCache && localMemory.resetCache(localCache);
    sessionCache && sessionMemory.resetCache(sessionCache);
}

export function Persistent() {}

Persistent.getLocal = function (key) {
    return localMemory.get(key) ? localMemory.get(key).value : localMemory.get(key);
}

Persistent.setLocal = function (key, value, immediate = false) {
    localMemory.set(key, value);
    immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
}

Persistent.removeLocal = function (key, immediate = false) {
    localMemory.remove(key);
    immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
}

Persistent.clearLocal = function (immediate = false) {
    localMemory.clear();
    immediate && ls.clear();
}

Persistent.getSession = function (key) {
    return sessionMemory.get(key).value;
}

Persistent.setSession = function (key, value, immediate = false) {
    sessionMemory.set(key, value);
    immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache);
}

Persistent.removeSession = function (key, immediate = false) {
    sessionMemory.remove(key);
    immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache);
}

Persistent.clearSession = function (immediate = false) {
    sessionMemory.clear();
    immediate && ss.clear();
}

Persistent.clearAll = function (immediate = false) {
    sessionMemory.clear();
    localMemory.clear();
    if (immediate) {
        ls.clear();
        ss.clear();
    }
}

window.addEventListener('beforeunload', function () {
    // TOKEN_KEY 在登录或注销时已经写入到storage了，此处为了解决同时打开多个窗口时token不同步的问题
    // LOCK_INFO_KEY 在锁屏和解锁时写入，此处也不应修改
    ls.set(APP_LOCAL_CACHE_KEY, {
        ...omit(localMemory.getCache, LOCK_INFO_KEY),
        ...pick(ls.get(APP_LOCAL_CACHE_KEY), [TOKEN_KEY, USER_INFO_KEY, LOCK_INFO_KEY]),
    });
    ss.set(APP_SESSION_CACHE_KEY, {
        ...omit(sessionMemory.getCache, LOCK_INFO_KEY),
        ...pick(ss.get(APP_SESSION_CACHE_KEY), [TOKEN_KEY, USER_INFO_KEY, LOCK_INFO_KEY]),
    });
});

function storageChange(e) {
    const { key, newValue, oldValue } = e;

    if (!key) {
        Persistent.clearAll();
        return;
    }

    if (!!newValue && !!oldValue) {
        if (APP_LOCAL_CACHE_KEY === key) {
            Persistent.clearLocal();
        }
        if (APP_SESSION_CACHE_KEY === key) {
            Persistent.clearSession();
        }
    }
}

window.addEventListener('storage', storageChange);

initPersistentMemory();