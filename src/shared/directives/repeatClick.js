/**
 * Prevent repeated clicks
 * @Example v-repeat-click="()=>{}"
 */
import Vue from 'vue';
import { on, once } from '@/shared/utils/domUtils';

const repeatClickDirective = {
    beforeMount(el, binding) {
        let interval = null;
        let startTime = 0;
        const handler = binding.value();
        const clear = () => {
            if(Date.now() - startTime < 100) {
                handler();
            }
            interval && clearInterval(interval);
            interval = null;
        };
        on(el, 'mousedown', (e) => {
            if(e.button !== 0) return;
            once(document, clear);
            interval && clearInterval(interval);
            interval = setInterval(handler, 100);
        });
    }
}

export function setupRepeatClickDirective() {
    Vue.directive('repeatClick', repeatClickDirective);
}