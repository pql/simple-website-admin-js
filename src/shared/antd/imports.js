import { registerAntDesignVueComponents } from './import-components';
import { registerAntDesignVueIcons } from './import-icons';

export function setupAntDesignVue() {
    // register ant-design-vue icons what we need
    // 按需注册 ant-design-vue 图标
    registerAntDesignVueIcons();
    // register ant-design-vue components
    // 按需注册 ant-design-vue 组件
    registerAntDesignVueComponents();
}



