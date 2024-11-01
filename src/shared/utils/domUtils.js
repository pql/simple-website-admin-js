
import { upperFirst } from 'lodash';

/**
 * 
 * @param {string} attr 
 * @param {string} value 
 * @returns 
 */
export function hackCss(attr, value) {
    const prefix = ['webkit', 'Moz', 'ms', 'OT'];

    const styleObj = {};
    prefix.forEach((item) => {
        styleObj[`${item}${upperFirst(attr)}`] = value;
    });
    return {
        ...styleObj,
        [attr]: value,
    };
}

function trim(string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
}

/**
 * 
 * @param {Element} el 
 * @param {string} cls 
 * @returns 
 */
export function hasClass(el, cls) {
    if (!el || !cls) return false;
    if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
    if (el.classList) {
        return el.classList.contains(cls);
    } else {
        return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
}

/**
 * 
 * @param {Element} el 
 * @param {string} cls 
 * @returns 
 */
export function addClass(el, cls) {
    if (!el) return;
    let curClass = el.className;
    const classes = (cls || '').split(' ');

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.add(clsName);
        } else if (!hasClass(el, clsName)) {
            curClass += ' ' + clsName;
        }
    }
    if (!el.classList) {
        el.className = curClass;
    }
}

/**
 * 
 * @param {Element} el 
 * @param {string} cls 
 * @returns 
 */
export function removeClass(el, cls) {
    if (!el || !cls) return;
    const classes = cls.split(' ');
    let curClass = ' ' + el.className + ' ';

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.remove(clsName);
        } else if (hasClass(el, clsName)) {
            curClass = curClass.replace(' ' + clsName + ' ', ' ');
        }
    }
    if (!el.classList) {
        el.className = trim(curClass);
    }
}

/**
 * 
 * @param {Element | HTMLElement | Document | Window} element 
 * @param {string} event 
 * @param {EventListenerOrEventListenerObject} handler 
 * @returns {void}
 */
export function on(element, event, handler) {
    if (element && event && handler) {
        element.addEventListener(event, handler, false);
    }
}

/**
 * 
 * @param {Element | HTMLElement | Document | Window} element 
 * @param {string} event 
 * @param {Fn} handler
 * @returns {void} 
 */
export function off(
    element,
    event,
    handler,
) {
    if (element && event && handler) {
        element.removeEventListener(event, handler, false);
    }
}

/**
 * 
 * @param {HTMLElement} el 
 * @param {string} event 
 * @param {EventListener} fn 
 * @returns {void}
 */
export function once(el, event, fn) {
    const listener = function (...args) {
        if (fn) {
            fn.apply(this, args);
        }
        off(el, event, listener);
    };
    on(el, event, listener);
}
