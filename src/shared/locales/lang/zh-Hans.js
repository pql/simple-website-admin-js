import { genMessage } from '@/shared/locales/helper';

/**
 * directory（必填）：一个字符串，表示要搜索的目录的绝对路径或相对于当前文件的相对路径。
 * useSubdirectories（可选，默认为 false）：一个布尔值，表示是否还应该搜索子目录。
 * regExp（可选，默认为 /^\.\//）：一个正则表达式，用于匹配目录下的文件。
 */
const context = require.context('./zh-Hans', true, /\/*\.(json|js)$/);
// 获取 ./zh-Hans 路径下所有的json文件，将所有模块整合成到一起
const modules  = context.keys().reduce((acc, key) => {
    const module = context(key);
    acc[key] = module;
    return acc;
}, {});

export default {
    message: {
        ...genMessage(modules, 'zh-Hans')
    }
}