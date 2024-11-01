import Vue from 'vue';
import { Button, Tree, Spin, Icon, Layout } from 'ant-design-vue';

/**
 * @description register ant-design-vue components
 * @description 按需注册 ant-design-vue 组件
 */
export function registerAntDesignVueComponents() {
    Vue.use(Layout);
    Vue.use(Button);
    Vue.use(Tree);
    Vue.use(Spin);
    Vue.use(Icon);
}