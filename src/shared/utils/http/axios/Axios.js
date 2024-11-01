import axios from 'axios';
import qs from 'qs';
import { AxiosCanceler } from './axiosCanceler';
import { isFunction } from '@/shared/utils/is';
import { CONTENT_TYPE_ENUM, REQUEST_ENUM } from '@/shared/enums/http';
import { cloneDeep } from 'lodash';

export * from './axiosTransform';

export function VAxios(options) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors();
}

/**
 * @description:  Create axios instance
 */
VAxios.prototype.createAxios = function (config) {
    this.axiosInstance = axios.create(config);
}

VAxios.prototype.getTransform = function () {
    const { transform } = this.options;
    return transform;
}

VAxios.prototype.getAxios = function () {
    return this.axiosInstance;
}

/**
 * @description: Reconfigure axios
 */
VAxios.prototype.configAxios = function (config) {
    if (!this.axiosInstance) {
        return;
    }
    this.createAxios(config);
}

/**
 * @description: Set general header
 */
VAxios.prototype.setHeader = function (headers) {
    if (!this.axiosInstance) {
        return;
    }
    Object.assign(this.axiosInstance.defaults.headers, headers);
}

/**
 * @description: Interceptor configuration 拦截器配置
 */
VAxios.prototype.setupInterceptors = function () {
    const { axiosInstance, options: { transform } } = this;
    if (!transform) {
        return;
    }
    const {
        requestInterceptors,
        requestInterceptorsCatch,
        responseInterceptors,
        responseInterceptorsCatch,
    } = transform;

    const axiosCanceler = new AxiosCanceler();

    // Request interceptor configuration processing
    this.axiosInstance.interceptors.request.use((config) => {
        // If cancel repeat request is turned on, then cancel repeat request is prohibited
        const requestOptions = (config.requestOptions) || this.options.requestOptions;
        const ignoreCancelToken = requestOptions.ignoreCancelToken || true;

        !ignoreCancelToken && axiosCanceler.addPending(config);

        if (requestInterceptors && isFunction(requestInterceptors)) {
            config = requestInterceptors(config, this.options);
        }
        return config;
    }, undefined);

    // Request interceptor error capture
    requestInterceptorsCatch &&
        isFunction(requestInterceptorsCatch) &&
        this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

    // Response result interceptor processing
    this.axiosInstance.interceptors.response.use((res) => {
        res && axiosCanceler.removePending(res.config);
        if (responseInterceptors && isFunction(responseInterceptors)) {
            res = responseInterceptors(res);
        }
        return res;
    }, undefined);

    // Response result interceptor error capture
    responseInterceptorsCatch &&
        isFunction(responseInterceptorsCatch) &&
        this.axiosInstance.interceptors.response.use(undefined, (error) => {
            return responseInterceptorsCatch(axiosInstance, error);
        });
}

/**
 * @description:  File Upload
 */
VAxios.prototype.uploadFile = function (config, params) {
    const formData = new window.FormData();
    const customFilename = params.name || 'file';

    if (params.filename) {
        formData.append(customFilename, params.file, params.filename);
    } else {
        formData.append(customFilename, params.file);
    }

    if (params.data) {
        Object.keys(params.data).forEach((key) => {
            const value = params.data[key];
            if (Array.isArray(value)) {
                value.forEach((item) => {
                    formData.append(`${key}[]`, item);
                });
                return;
            }
            formData.append(key, params.data[key]);
        });
    }

    return this.axiosInstance.request({
        ...config,
        method: 'POST',
        data: formData,
        headers: {
            'Content-type': CONTENT_TYPE_ENUM.FORM_DATA,
            // @ts-ignore
            ignoreCancelToken: true,
        },
    });
}

// support form-data
VAxios.prototype.supportFormData = function (config) {
    const headers = config.headers || this.options.headers;
    const contentType = headers['Content-Type'] || headers['content-type'];

    if (contentType !== CONTENT_TYPE_ENUM.FORM_URLENCODED ||
        !Reflect.has(config, 'data') ||
        config.method.toUpperCase() === REQUEST_ENUM.GET
    ) {
        return config;
    }

    return {
        ...config,
        data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
    }
}

VAxios.prototype.get = function (config, options) {
    return this.request({ ...config, method: 'GET' }, options);
}

VAxios.prototype.post = function (config, options) {
    return this.request({ ...config, method: 'POST' }, options);
}

VAxios.prototype.put = function (config, options) {
    return this.request({ ...config, method: 'PUT' }, options);
}

VAxios.prototype.delete = function (config, options) {
    return this.request({ ...config, method: 'DELETE' }, options);
}

VAxios.prototype.request = function (config, options) {
    let conf = cloneDeep(config);
    // cancelToken 如果被深拷贝，会导致最外层无法使用cancel方法来取消请求
    if (config.cancelToken) {
        conf.cancelToken = config.cancelToken;
    }

    if (config.signal) {
        conf.signal = config.signal;
    }

    const transform = this.getTransform();

    const { requestOptions } = this.options;

    const opt = Object.assign({}, requestOptions, options);

    const { beforeRequestHook, requestCatchHook, transformResponseHook } = transform || {};

    if (beforeRequestHook && isFunction(beforeRequestHook)) {
        conf = beforeRequestHook(conf, opt);
    }

    conf.requestOptions = opt;

    conf = this.supportFormData(conf);

    return new Promise((resolve, reject) => {
        this.axiosInstance.request(conf)
            .then((res) => {
                if (transformResponseHook && isFunction(transformResponseHook)) {
                    try {
                        const ret = transformResponseHook(res, opt);
                        resolve(ret);
                    } catch (err) {
                        reject(err || new Error('request error!'));
                    }
                    return;
                }
                resolve(res);
            }).catch((e) => {
                if (requestCatchHook && isFunction(requestCatchHook)) {
                    reject(requestCatchHook(e, opt));
                    return;
                }
                // if (axios.isAxiosError(e)) {
                    // rewrite error message from axios in here
                // }
                reject(e);
            });
    });

}