
/**
 * Global ellipsis directive
 * Used for fine-grained control of text ellipsis
 * @Example v-ellipsis="[100, 1]"
 * @Example v-ellipsis:multiple="[100, 1]"
 */
import Vue from 'vue';

const cssProperties = {
    single: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    multiple: {
        display: '-webkit-box',
        overflow: 'hidden',
        wordBreak: 'break-all',
    },
};

const ellipsisDirective = {
    inserted(el, binding) {
        const { value = [100, 1], arg = "single" } = binding;
        const [width, line] = value;
        Object.entries(cssProperties[arg]).forEach(([key, value]) => {
            el.style[key] = value;
        });
        el.style.width = `${width}px`;
        if (arg === 'multiple') {
            el.style.webkitLineClamp = `${line}`;
            el.style.webkitBoxOrient = 'vertical';
        }
    }
}

export function setupEllipsisDirective() {
    Vue.directive('ellipsis', ellipsisDirective);
}

export default ellipsisDirective;