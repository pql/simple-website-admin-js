import { decrypt as aesDecrypt, encrypt as aesEncrypt } from 'crypto-js/aes';
import UTF8, { parse } from 'crypto-js/enc-utf8';
import pkcs7 from 'crypto-js/pad-pkcs7';
import CTR from 'crypto-js/mode-ctr';
import Base64 from 'crypto-js/enc-base64';
import MD5 from 'crypto-js/md5';
import SHA256 from 'crypto-js/sha256';
import SHA512 from 'crypto-js/sha512';

function AesEncryption(options) {

    // 检查 options 是否为对象且包含 key 和 iv 属性  
    if (typeof options !== 'object' || options === null || !options.hasOwnProperty('key') || !options.hasOwnProperty('iv')) {
        throw new Error('Options must be an object containing key and iv properties');
    }

    // 使用闭包来隐藏 key 和 iv
    var _key = parse(options.key);
    var _iv = parse(options.iv);

    // 返回一个对象，该对象包含可以访问 key 和 iv 的方法，但不允许直接修改它们
    var obj = {};

    // 封装对 key 的访问
    Object.defineProperty(obj, 'key', {
        get: function () {
            return _key;
        },
        // 禁止设置 writable 特性，因此 key 是只读的
        set: function () {
            throw new Error('key is readonly');
        },
        enumerable: true, // 默认情况下是 false, 根据需要设置 为 true 或 false
    });

    // 封装对 iv 的访问
    Object.defineProperty(obj, 'iv', {
        get: function () {
            return _iv;
        },
        // 禁止设置 writable 特性，因此 iv 是只读的
        set: function () {
            throw new Error('iv is readonly');
        },
        enumerable: true, // 默认情况下是 false, 根据需要设置 为 true 或 false
    });

    return obj;
}

AesEncryption.getOptions = function () {
    return {
        mode: CTR,
        padding: pkcs7,
        iv: this.iv
    }
}

AesEncryption.encrypt = function (plainText) {
    return aesEncrypt(plainText, this.key, this.getOptions).toString();
}

AesEncryption.decrypt = function (cipherText) {
    return aesDecrypt(cipherText, this.key, this.getOptions).toString(UTF8);
}

// Define a singleton class for Base64 encryption
var Base64Encryption = (function () {
    // 单例
    var instance;

    // 私有构造函数 
    function Base64Encryption() {

    }

    Base64Encryption.prototype.encrypt = function (plainText) {
        return UTF8.parse(plainText).toString(Base64);
    }

    Base64Encryption.prototype.decrypt = function (cipherText) {
        return Base64.parse(cipherText).toString(UTF8);
    }

    // 获取单例实例
    Base64Encryption.getInstance = function () {
        if (!instance) {
            instance = new Base64Encryption();
        }
        return instance;
    };

    // 返回构造函数（尽管在单例模式中不使用）
    return Base64Encryption;
})();

// Define a singleton class for MD5 Hashing
var MD5Hashing = (function () {
    // 单例
    var instance;

    // 私有构造函数
    function MD5Hashing() {

    }

    MD5Hashing.prototype.hash = function (plainText) {
        return MD5(plainText).toString();
    }

    // 获取单例实例
    MD5Hashing.getInstance = function () {
        if (!instance) {
            instance = new MD5Hashing();
        }
        return instance;
    }

})();


// Define a singleton class for SHA256 Hashing
var SHA256Hashing = (function () {
    // 单例
    var instance;

    // 私有构造函数
    function SHA256Hashing() {

    }
    
    SHA256Hashing.prototype.hash = function (plainText) {
        return SHA256(plainText).toString();
    }

    // 获取单例实例
    SHA256Hashing.getInstance = function () {
        if (!instance) {
            instance = new SHA256Hashing();
        }
        return instance;
    }
})();


// Define a singleton class for SHA512 Hashing
var SHA512Hashing = (function () {
    // 单例
    var instance;

    // 私有构造函数
    function SHA512Hashing() {

    }
    
    SHA512Hashing.prototype.hash = function (plainText) {
        return SHA512(plainText).toString();
    }

    // 获取单例实例
    SHA512Hashing.getInstance = function () {
        if (!instance) {
            instance = new SHA512Hashing();
        }
        return instance;
    }
})();


export function EncryptionFactory() {

}

EncryptionFactory.createAesEncryption = (params) => {
    return new AesEncryption(params);
}

EncryptionFactory.createBase64Encryption = () => {
    return Base64Encryption.getInstance();
}


export function HashingFactory () {

}

HashingFactory.prototype.createMD5Hashing = function() {
    return MD5Hashing.getInstance();
}

HashingFactory.prototype.createSHA256Hashing = function() {
    return SHA256Hashing.getInstance();
}

HashingFactory.prototype.createSHA512Hashing = function() {
    return SHA512Hashing.getInstance();
}



