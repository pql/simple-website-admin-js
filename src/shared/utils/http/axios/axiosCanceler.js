
// 用于存储每个请求的标识和取消函数
const pendingMap = new Map();

const getPendingUrl = (config) => {
    return [config.method, config.url].join('&');
};

export function AxiosCanceler() {

}

/**
 * 添加请求
 * @param config 请求配置
 */
AxiosCanceler.prototype.addPending = function (config) {
    this.removePending(config);
    const url = getPendingUrl(config);
    const controller = new AbortController();
    config.signal = config.signal || controller.signal;
    if (!pendingMap.has(url)) {
        // 如果当前请求不在等待中，将其添加到等待中
        pendingMap.set(url, controller);
    }
}

/**
 * 清除所有等待中的请求
 */
AxiosCanceler.prototype.removeAllPending = function () {
    pendingMap.forEach((abortController) => {
        if (abortController) {
            abortController.abort();
        }
    });
    this.reset();
}

/**
 * 移除请求
 * @param config 请求配置
 */
AxiosCanceler.prototype.removePending = function (config) {
    const url = getPendingUrl(config);
    if (pendingMap.has(url)) {
        // 如果当前请求在等待中，取消它并将其从等待中移除
        const abortController = pendingMap.get(url);
        if (abortController) {
            abortController.abort(url);
        }
        pendingMap.delete(url);
    }
}

/**
 * 重置
 */
AxiosCanceler.prototype.reset = function () {
    pendingMap.clear();
}