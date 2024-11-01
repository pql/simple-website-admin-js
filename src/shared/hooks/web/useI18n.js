import { i18n } from "@/shared/locales/setupI18n";

/**
 * 翻译函数
 * @param {string} key 
 * @param  {...any} args 
 * @returns {string}
 */
function translate(key, ...args) {
    return i18n.t(key, ...args);
}

export function useI18n() {
    return {
        l: translate,
        t: translate
    }
}

// Why write this function？
// Mainly to configure the vscode i18nn ally plugin. This function is only used for routing and menus. Please use useI18n for other places

// 为什么要编写此函数？
// 主要用于配合vscode i18nn ally插件。此功能仅用于路由和菜单。请在其他地方使用useI18n
export const t = (key) => key;
