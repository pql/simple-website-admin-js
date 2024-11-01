/**
 * 反序列化
 * @param {*} value 
 * @returns 
 */
export const deserialize = (value) => {
    try {
        const parsed = JSON.parse(value);
        return parsed;
    } catch (e) {
        return {};
    }
}

/**
 * 序列化
 * @param {*} value 
 * @returns 
 */
export const serialize = (value) => {
    try {
        const serialized = JSON.stringify(value);
        return serialized;
    } catch (e) {
        return '';
    }
}