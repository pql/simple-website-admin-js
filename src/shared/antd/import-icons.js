// https://github.com/ant-design/ant-design-icons/tree/2.x/packages/icons-vue

import Vue from 'vue';
import AntdIcon from '@ant-design/icons-vue';

import { 
    AntDesignOutline,
    MenuUnfoldOutline,
    MenuFoldOutline,
} from '@ant-design/icons';

const Icons = [
    AntDesignOutline,
    MenuUnfoldOutline,
    MenuFoldOutline,
];

/**
 * @description register ant-design-vue icons what we need
 * @description 按需注册 ant-design-vue 图标
*/
export function registerAntDesignVueIcons() {
    AntdIcon.add(...Icons);
    Vue.use(AntdIcon);
}