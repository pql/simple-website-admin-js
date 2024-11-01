import { cacheCipher } from '@/shared/settings/encryptionSetting';
import { EncryptionFactory } from '@/shared/utils/cipher';
import { isNil } from 'lodash';

export const createStorage = ({
    prefixKey = '',
    storage = sessionStorage,
    key = cacheCipher.key,
    iv = cacheCipher.iv,
    timeout = null,
    hasEncrypt = true,
}) => {
    if (hasEncrypt && [key.length, iv.length].some((item) => item !== 16)) {
        throw new Error('When hasEncrypt is true, the key or iv must be 16 bits!');
    }

    const persistEncryption = EncryptionFactory.createAesEncryption({
        key: cacheCipher.key,
        iv: cacheCipher.iv,
    });

    /**
     * Cache class
     * Construction parameters can be passed into sessionStorage, localStorage,
     * @class Cache
     * @example
     */
    // const WebStorage = class WebStorage {
    //     /**
    //      *
    //      * @param {*} storage
    //      */
    //     constructor() {
    //         this.storage = storage;
    //         this.prefixKey = prefixKey;
    //         this.encrypt = persistEncryption;
    //         this.hasEncrypt = hasEncrypt;
    //     }

    //     getKey(key) {
    //         return `${this.prefixKey}${key}`.toUpperCase();
    //     }

    //     /**
    //      * Set cache
    //      * @param {string} key
    //      * @param {*} value
    //      * @param {number|null} expire Expiration time in seconds
    //      * @memberof Cache
    //      */
    //     set(key, value, expire = timeout) {
    //         const stringData = JSON.stringify({
    //             value,
    //             time: Date.now(),
    //             expire: !isNil(expire) ? new Date().getTime() + expire * 1000 : null,
    //         });
    //         const stringifyValue = this.hasEncrypt ? this.encryption.encrypt(stringData) : stringData;
    //         this.storage.setItem(this.getKey(key), stringifyValue);
    //     }

    //     /**
    //      * Read cache
    //      * @param {string} key
    //      * @param {*} def
    //      * @memberof Cache
    //      */
    //     get(key, def = null) {
    //         const val = this.storage.getItem(this.getKey(key));
    //         if (!val) return def;

    //         try {
    //             const decVal = this.hasEncrypt ? this.encryption.decrypt(val) : val;
    //             const data = JSON.parse(decVal);
    //             const { value, expire } = data;
    //             if (isNil(expire) || expire >= new Date().getTime()) {
    //                 return value;
    //             }
    //             this.remove(key);
    //         } catch (e) {
    //             return def;
    //         }
    //     }

    //     /**
    //      * Delete cache based on key
    //      * @param {string} key
    //      * @memberof Cache
    //      */
    //     remove(key) {
    //         this.storage.removeItem(this.getKey(key));
    //     }

    //     /**
    //      * Delete all caches of this instance
    //      */
    //     clear() {
    //         this.storage.clear();
    //     }
    // }

    /**
     * Cache class
     * Construction parameters can be passed into sessionStorage, localStorage,
     * @class Cache
     * @example
     */

    var WebStorage = (function () {
        function WebStorage() {
            this.storage = storage;
            this.prefixKey = prefixKey;
            this.encryption = persistEncryption;
            this.hasEncrypt = hasEncrypt;
        }

        WebStorage.prototype.getKey = function (key) {
            return `${this.prefixKey}${key}`.toUpperCase();
        }

        /**
         * Set cache
         * @param {string} key
         * @param {*} value
         * @param {*} expire Expiration time in seconds
         * @memberof Cache
         */
        WebStorage.prototype.set = function (key, value, expire = timeout) {
            const stringData = JSON.stringify({
                value,
                time: Date.now(),
                expire: !isNil(expire) ? new Date().getTime() + expire * 1000 : null,
            });
            const stringifyValue = this.hasEncrypt ? this.encryption.encrypt(stringData) : stringData;
            this.storage.setItem(this.getKey(key), stringifyValue);
        }

        /**
         * Read cache
         * @param {string} key
         * @param {*} def
         * @memberof Cache
         */
        WebStorage.prototype.get = function (key, def = null) {
            const val = this.storage.getItem(this.getKey(this.key));
            if (!val) return def;

            try {
                const decVal = this.hasEncrypt ? this.encryption.decrypt(val) : val;
                const data = JSON.parse(decVal);
                const { value, expire } = data;
                if (isNil(expire) || expire >= new Date().getTime()) {
                    return value;
                }
                this.remove(key);
            } catch (e) {
                return def;
            }
        }

        /**
         * Delete cache based on key
         * @param {string} key
         * @memberof Cache
        */
        WebStorage.prototype.remove = function (key) {
            this.storage.removeItem(this.getItem(key));
        }

        /**
         * Delete all caches of this instance
         */
        WebStorage.prototype.clear = function () {
            this.storage.clear();
        }

        return WebStorage;

    })();

    return new WebStorage();
}