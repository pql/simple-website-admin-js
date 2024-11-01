// 默认配置
/**
 * @type {TreeHelperConfig} DEFAULT_CONFIG
 */
const DEFAULT_CONFIG = {
    id: 'id',
    children: 'children',
    pid: 'pid',
};

/**
 * 获取配置。Object.assign 从一个或多个源对象复制到目标对象
 * @param {Partial<TreeHelperConfig>} config 
 * @returns 
 */
const getConfig = (config) => Object.assign({}, DEFAULT_CONFIG, config);

/**
 * tree from list
 * @param {any[]} list 
 * @param {Partial<TreeHelperConfig>} config 
 */
export function listToTree(list, config = {}) {
    const conf = getConfig(config);
    const nodeMap = new Map();
    const result = [];
    const { id, children, pid } = conf;

    for (const node of list) {
        node[children] = node[children] || [];
        nodeMap.set(node[id], node);
    }

    for (const node of list) {
        const parent = nodeMap.get(node[pid]);
        (parent ? parent[children] : result).push(node);
    }
    return result;
}

/**
 * tree to list
 * @param {any} tree 
 * @param {Partial<TreeHelperConfig>} config 
 * @returns {any[]}
 */
export function treeToList(tree, config = {}) {
    config = getConfig(config);
    const { children } = config;
    const result = [...tree];
    for (let i = 0; i < result.length; i++) {
        if (!result[i][children]) continue;
        result.splice(i + 1, 0, ...result[i][children]);
    }
    return result;
}


/**
 * @param {any} tree 
 * @param {Fn} func 
 * @param {Partial<TreeHelperConfig>} config 
 * @returns {T | T[] | nul}
 */
export function findPath(
    tree,
    func,
    config = {},
) {
    config = getConfig(config);
    const path = [];
    const list = [...tree];
    const visitedSet = new Set();
    const { children } = config;
    while (list.length) {
        const node = list[0];
        if (visitedSet.has(node)) {
            path.pop();
            list.shift();
        } else {
            visitedSet.add(node);
            node[children] && list.unshift(...node[children]);
            path.push(node);
            if (func(node)) {
                return path;
            }
        }
    }
    return null;
}



/**
 * 
 * @param {T[]} tree 
 * @param {(n: T) => boolean} func 
 * @param {Partial<TreeHelperConfig>} config 
 * @returns 
 */
export function filter(
    tree,
    func,
    // Partial 将 T 中的所有属性设为可选
    config = {},
) {
    // 获取配置
    config = getConfig(config);
    const children = config.children;

    function listFilter(list) {
        return list
            .map((node) => ({ ...node }))
            .filter((node) => {
                // 递归调用 对含有children项  进行再次调用自身函数 listFilter
                node[children] = node[children] && listFilter(node[children]);
                // 执行传入的回调 func 进行过滤
                return func(node) || (node[children] && node[children].length);
            });
    }

    return listFilter(tree);
}

/**
 * @description: Extract tree specified structure
 * @description: 提取树指定结构
 * @param {T[]} treeData 
 * @param opt
 * @property {string} children
 * @property {Fn} conversion
 * @returns {any[]}
 */
export function treeMap(treeData, opt) {
    return treeData.map((item) => treeMapEach(item, opt));
}

/**
 * @description: Extract tree specified structure
 * @description: 提取树指定结构
 * @param {any} data 
 * @param param1 
 * @property {string} children = 'children'
 * @property {Fn} conversion
 * @returns 
 */
export function treeMapEach(
    data,
    { children = 'children', conversion }
) {
    const haveChildren = Array.isArray(data[children]) && data[children].length > 0;
    const conversionData = conversion(data) || {};
    if (haveChildren) {
        return {
            ...conversionData,
            [children]: data[children].map((i) =>
                treeMapEach(i, {
                    children,
                    conversion,
                }),
            ),
        };
    } else {
        return {
            ...conversionData,
        };
    }
}