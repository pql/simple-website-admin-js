const NOT_ALIVE = 0;

export function Memory(alive = NOT_ALIVE) {
    // 私有变量，通过闭包封装 
    var _cache = {};
    // Unit second
    var _alive = (alive === undefined) ? NOT_ALIVE * 1000 : alive * 1000; // 默认alive为NOT_ALIVE的毫秒值

    // 公开方法，用于获取cache对象  
    this.getCache = function () {
        return _cache;
    }

    this.setCache = function (cache) {
        _cache = cache;
    }

    this.get = function (key) {
        return _cache[key];
    }

    this.set = function (key, value, expires) {
        let item = this.get(key);
        if (!expires || +expires <= 0) {
            expires = _alive;
        }

        if (item) {
            if (item.timeoutId) {
                clearTimeout(item.timeoutId);
                item.timeoutId = undefined;
            }
            item.value = value;
        } else {
            item = { value, alive, expires };
            _cache[key] = item;
        }

        if (!expires) {
            return value;
        }

        const now = new Date().getTime();
        /**
        * Prevent overflow of the setTimeout Maximum delay value
        * Maximum delay value 2,147,483,647 ms
        * https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value
        */
        item.time = expires > now ? expires : now + expires;
        item.timeoutId = setTimeout(() => {
            this.remove(key);
        }, expires > now ? expires - now : expires);
        return value;
    }

    this.remove = function (key) {
        const item = this.get(key);
        Reflect.deleteProperty(_cache, key);
        if (item) {
            clearTimeout(item.timeoutId);
            return item.value;
        }
    }

    this.resetCache = function (cache) {
        Object.keys(cache).forEach((key) => {
            const k = key;
            const item = cache[k];
            if (item && item.time) {
                const now = new Date().getTime();
                const expire = item.time;
                if(expire > now) {
                    this.set(k, item.value, expire);
                }
            }
        });
    }

    this.clear = function() {
        Object.keys(_cache).forEach((key) => {
            const item = _cache[key];
            item.timeoutId && clearTimeout(item.timeoutId);
        });
        _cache = {};
    }
}


