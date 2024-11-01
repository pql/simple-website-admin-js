
/**
 *  请求重试机制
 */
export function AxiosRetry() {

}

/**
 * 重试
 * @param {AxiosInstance} axiosInstance 
 * @param {AxiosError} error 
 */
AxiosRetry.prototype.retry = function (axiosInstance, error) {
    const { config } = error.response;
    const { waitTime, count } = config.requestOptions.retryRequest || {};
    config.__retryCount = config.__retryCount || 0;
    if (config.__retryCount >= count) {
        return Promise.reject(error);
    }
    config.__retryCount += 1;
    return this.delay(waitTime).then(() => axiosInstance(config));
}

/**
 * 延迟
 * @param {number} waitTime 
 */
AxiosRetry.prototype.delay = function (waitTime) {
    return new Promise((resolve) => setTimeout(resolve, waitTime));
}