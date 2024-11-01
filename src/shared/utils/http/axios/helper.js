import { isArray, isObject, isString } from '@/shared/utils/is';
import { DATE_TIME_FORMAT, isValid, formatToDateTime } from '@/shared/utils/dateUtil';

/**
 * 
 * @param {boolean} join 
 * @param {any} restful 
 * @returns [string | object]
 */
export function joinTimestamp(join, restful = false) {
    if (!join) {
        return restful ? '' : {};
    }
    const now = new Date().getTime();
    if (restful) {
        return `?_t=${now}`;
    }
    return { _t: now };
}

/**
 * @description: Format request parameter time
 */
export function formatRequestDate(params) {
    if (Object.prototype.toString.call(params) !== '[object Object]') {
        return;
    }

    for (const key in params) {
        const format = params[key].format ?? null;
        if (format && typeof format === 'function') {
            params[key] = params[key].format(DATE_TIME_FORMAT);
        }
        if (isString(key)) {
            const value = params[key];
            if (value) {
                try {
                    params[key] = isString(value) ? value.trim() : value;
                    /** 值类型为时间的转为带时区的时间类型 */
                    params[key] = isString(value) && isValid(value) ? formatToDateTime(value) : value;
                } catch (error) {
                    throw new Error(error);
                }
            }
        }
        if (isObject(params[key])) {
            formatRequestDate(params[key]);
        }
        if (isArray(params[key])) {
            params[key].forEach((d) => {
                formatRequestDate(d);
            });
        }
    }
}

/**
 * Format response parameter time
 * @param data
 */
export function formatResponseDate(data) {
    if (Object.prototype.toString.call(data) !== '[object Object]') {
        return;
    }

    for (const key in data) {
        if (isString(key)) {
            const value = data[key];
            if (value) {
                try {
                    data[key] = isString(value) ? value.trim() : value;
                    data[key] = isString(value) && isValid(value) ? formatToDateTime(value) : value;
                } catch (error) {
                    throw new Error(error);
                }
            }
        }
        if (isObject(data[key])) {
            formatResponseDate(data[key]);
        }
        if (isArray(data[key])) {
            data[key].forEach((d) => {
                formatResponseDate(d);
            });
        }
    }
}
