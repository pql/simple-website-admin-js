/**
 * 
 * @param {*} a 
 */
export function AxiosTransform(a) {

}

/**
 * A function that is called before a request is sent. It can modify the request configuration as needed.
 * 在发送请求之前调用的函数。它可以根据需要修改请求配置。
 * @param {AxiosRequestConfig} config
 * @param {RequestOptions} options
 * @returns {AxiosRequestConfig}
 */
AxiosTransform.prototype.beforeRequestHook = (config, options) => { };

/**
 * @description: 处理响应数据
 * @param {AxiosResponse<Result>} res
 * @param {RequestOptions} options
 * @returns {any}
 */
AxiosTransform.prototype.transformResponseHook = (res, options) => { };

/**
 * @description: 请求失败处理
 * @param {Error} e
 * @param {RequestOptions} options
 * @returns {Promise<any>}
 */
AxiosTransform.prototype.requestCatchHook = (e, options) => { };

/**
 * @description: 请求之前的拦截器
 * @param {InternalAxiosRequestConfig} config
 * @param {CreateAxiosOptions} options
 * @returns {InternalAxiosRequestConfig}
 */
AxiosTransform.prototype.requestInterceptors = (config, options,) => { };

/**
 * @description: 请求之后的拦截器
 * @param {AxiosResponse<any>} res
 * @returns {AxiosResponse<any>}
 */
AxiosTransform.prototype.responseInterceptors = (res) => { };

/**
 * @description: 请求之前的拦截器错误处理
 * @param {Error} error
 * @returns {void}
 */
AxiosTransform.prototype.requestInterceptorsCatch = (error) => { };

/**
 * @description: 请求之后的拦截器错误处理
 * @param {AxiosInstance} axiosInstance
 * @param {Error} error
 * @returns {void}
 */
AxiosTransform.prototype.responseInterceptorsCatch = (axiosInstance, error) => { };