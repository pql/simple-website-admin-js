/**
 * Global authority directive
 * Used for fine-grained control of component permissions
 * @Example v-auth="RoleEnum.TEST"
 */

import Vue from 'vue';
import { usePermission } from '@/shared/hooks/web/usePermission';

const isAuthInserted = (el, binding) => {
    const { hasPermission } = usePermission();
    const value = binding.value;
    if (!value) return;
    if (!hasPermission(value)) {
        const parentNode = el.parentNode;
        parentNode && parentNode.removeChild(el);
    }
}

const authDirective = {
    inserted: isAuthInserted
}

export function setupPermissionDirective() {
    Vue.directive('auth', authDirective);
}

export default authDirective;