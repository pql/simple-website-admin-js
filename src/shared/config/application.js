// public 目录提供的是一个应急手段，当你通过绝对路径引用它时，留意应用将会部署到哪里。如果你的应用没有部署在域名的根部，那么你需要为你的 URL 配置 publicPath 前缀
// https://cli.vuejs.org/zh/guide/html-and-static-assets.html#public-%E6%96%87%E4%BB%B6%E5%A4%B9
import appConfigDev from '/public/assets/appconfig.dev.json';
import appConfigProd from '/public/assets/appconfig.prod.json';

import { isProdMode } from "@/shared/utils/env";

/**
 * 获取客户端基础配置信息
 * @returns 
*/
export const getApplicationConfig = () => {
    try {
        console.log('isProdMode:', isProdMode());
        return isProdMode() ? appConfigProd : appConfigDev;
    } catch (error) {
        alert(`初始化配置信息出错，错误信息：\n\n${error.message}`);
    }
}

export default getApplicationConfig;