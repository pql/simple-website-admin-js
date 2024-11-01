import { intersectionWith, isEqual, mergeWith, unionWith } from 'lodash';
import { isArray, isObject } from '@/shared/utils/is';

export const uuid = () => {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

export const noop = () => { };

/**
 * @description:  Set ui mount node
 * @param {HTMLElement} node
 * @returns {HTMLElement}
 */
export function getPopupContainer(node) {
  return node.parentNode || document.body;
}

/**
 * Add the object as a parameter to the URL
 * @param {string} baseUrl
 * @param {any} obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl, obj) {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

/**
 * Recursively merge two objects.
 * 递归合并两个对象。
 *
 * @param source The source object to merge from. 要合并的源对象。
 * @param target The target object to merge into. 目标对象，合并后结果存放于此。
 * @param mergeArrays How to merge arrays. Default is "replace".
 *        如何合并数组。默认为replace。
 *        - "union": Union the arrays. 对数组执行并集操作。
 *        - "intersection": Intersect the arrays. 对数组执行交集操作。
 *        - "concat": Concatenate the arrays. 连接数组。
 *        - "replace": Replace the source array with the target array. 用目标数组替换源数组。
 * @returns The merged object. 合并后的对象。
 */
export function deepMerge(
  source,
  target,
  mergeArrays = 'replace',
) {
  if (!target) {
    return source
  }
  if (!source) {
    return target
  }
  return mergeWith({}, source, target, (sourceValue, targetValue) => {
    if (isArray(targetValue) && isArray(sourceValue)) {
      switch (mergeArrays) {
        case 'union':
          return unionWith(sourceValue, targetValue, isEqual);
        case 'intersection':
          return intersectionWith(sourceValue, targetValue, isEqual);
        case 'concat':
          return sourceValue.concat(targetValue);
        case 'replace':
          return targetValue;
        default:
          throw new Error(`Unknown merge array strategy: ${mergeArrays}`);
      }
    }
    if (isObject(targetValue) && isObject(sourceValue)) {
      return deepMerge(sourceValue, targetValue, mergeArrays);
    }
    return undefined;
  });
}

/**
 * 打开窗口
 * @param {string} url 
 * @param {object} opt 
 * @property {TargetContext | string | undefined} target
 * @property {boolean | undefined} noopener
 * @property {boolean | undefined} noreferrer
 */
export function openWindow(
  url,
  opt = {
    target: '__blank',
    noopener: true,
    noreferrer: true
  },
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
  const feature = [];

  noopener && feature.push('noopener=yes');
  noreferrer && feature.push('noreferrer=yes');

  window.open(url, target, feature.join(','));
}

export function getRawRoute(route) {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map(item => ({
        meta: item.meta,
        name: item.name,
        path: item.path
      })) : undefined)
  };
}

export const withInstall = (component) => {
  component.install = (app) => {
    const compName = component.name || component.displayName;
    if (!compName) return;
    app.component(compName, component);
  }
  return component;
}