import _ from 'lodash';

export function genAttrs(mods, prefix = 'modules') {
    const obj = {};
    Object.keys(mods).forEach((key) => {
        const langFileModule = mods[key].default || mods[key];
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