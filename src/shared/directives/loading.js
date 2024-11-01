
/**
 * Global loading directive
 * Used for app page loading
 * @Example v-loading="true|false"
 */
import Vue from 'vue';

const loadingDirective = {
    inserted(el, binding) {
        console.log('el', el, 'binding', binding);
    }
}

export function setupLoadingDirective() {
    Vue.directive('loading', loadingDirective);
}

export default loadingDirective;