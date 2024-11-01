import _ from 'lodash';

export const loadLocalePool = [];

export function setHtmlPageLang(locale) {
    if(_.isString(locale)) {
        document.querySelector('html').setAttribute('lang', locale);
    }
}

export function setLoadLocalePool(callback) {
    if(_.isFunction(callback)) {
        callback(loadLocalePool);
    }
}

export function genMessage(langs, prefix = 'lang') {
    const obj = {};
    Object.keys(langs).forEach((key) => {
        const langFileModule = langs[key].default || langs[key];
        let fileName = key.replace(`./${prefix}/`, '').replace(/^\.\//, '');
        const lastIndex = fileName.lastIndexOf('.');
        fileName = fileName.substring(0, lastIndex);
        const keyList = fileName.split('/');
        const moduleName = keyList.shift();
        const objKey = keyList.join('.');
    
        if (moduleName) {
          if (objKey) {
            _.set(obj, moduleName, obj[moduleName] || {});
            _.set(obj[moduleName], objKey, langFileModule);
          } else {
            _.set(obj, moduleName, langFileModule || {});
          }
        }
    });
    return obj;
}