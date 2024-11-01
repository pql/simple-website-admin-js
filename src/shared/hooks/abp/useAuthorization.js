import { store } from '@/shared/store/setupStore';
import { isUndefined } from 'lodash';

export function useAuthorization() {
    const abp = store.getters['abp/getApplicationConfiguration'];

    /**
     * 校验权限
     * @param {string|string[]} name 权限名称|权限名称集合
     * @param {boolean|undefined} requireAll [权限名称|权限名称集合]是否全部匹配权限集合,默认全部匹配权限集合
     * @returns {boolean}
     */
    function isGranted(name, requireAll) {
        const grantedPolicies = abp.auth && abp.auth.grantedPolicies || {};

        if(Array.isArray(name)) {
            if(isUndefined(requireAll) || requireAll === true) {
                return name.every(name => grantedPolicies[name]);
            }
            return name.some(name => grantedPolicies[name]);
        }
        return grantedPolicies[name] || false;
    }

    /**
     * 校验指定权限名，无权则抛出错误
     * @param {string|string[]} name 
     * @returns {void}
     */
    function authorize(name) {
        if(!isGranted(name)) {
            throw Error(`Authorization failed! Given policy has not granted: ${name}`);
        }
    }

    return {
        isGranted,
        authorize
    }
}