import { DEFAULT_CACHE_TIME, SHOULD_ENABLE_STORAGE_ENCRYPTION } from '@/shared/settings/encryptionSetting';
import { createStorage as create } from './storageCache';
import { getStorageShortName } from '@/shared/utils/env';

const createOptions = (storage, options = {}) => {
    return {
        // No encryption in debug mode
        hasEncrypt: SHOULD_ENABLE_STORAGE_ENCRYPTION,
        storage,
        prefixKey: getStorageShortName(),
        ...options,
    };
};

export const createStorage = (storage = sessionStorage, options = {}) => {
    return create(createOptions(storage, options));
};

export const createSessionStorage = (options = {}) => {
    return createStorage(sessionStorage, { ...options, timeout: DEFAULT_CACHE_TIME });
};

export const createLocalStorage = (options = {}) => {
    return createStorage(localStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
}