import { prefixCls } from '@/shared/settings/designSetting';

function genBem(name, mods) {
    if (!mods) {
        return '';
    }

    if (typeof mods === 'string') {
        return `${name}--${mods}`;
    }

    if (Array.isArray(mods)) {
        return mods.reduce((ret, item) => ret + genBem(name, item), '');
    }

    return Object.keys(mods).reduce((ret, key) => ret + (mods[key] ? genBem(name, key) : ''), '');
}

/**
 * bem helper
 * b() // 'button'
 * b('text') // 'button__text'
 * b({ disabled }) // 'button button--disabled'
 * b('text', { disabled }) // 'button__text button__text--disabled'
 * b(['disabled', 'primary']) // 'button button--disabled button--primary'
 */
export function buildBEM(name) {
    return (el, mods) => {
        if (el && typeof el !== 'string') {
            mods = el;
            el = '';
        }

        el = el ? `${name}__${el}` : name;

        return `${el}${genBem(el, mods)}`;
    };
}

/**
 * @param {string} name 
 * @returns {Array<string>}
 */
export function createBEM(name) {
    return [buildBEM(`${prefixCls}-${name}`)];
}

/**
 * @param {string} name 
 * @returns {Array<string>}
 */
export function createNamespace(name) {
    const prefixedName = `${prefixCls}-${name}`;
    return [prefixedName, buildBEM(prefixedName)];
}