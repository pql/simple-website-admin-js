import { VAxios } from './Axios';
import { deepMerge, setObjToUrlParams } from '@/shared/utils/index';
import { CONTENT_TYPE_ENUM } from '@/shared/enums/http';
import { clone } from 'lodash';
import { useGlobalSetting } from '@/shared/hooks/setting/index';
import { useI18n } from '@/shared/hooks/web/useI18n';
import { RESULT_ENUM, REQUEST_ENUM } from '@/shared/enums/http';
import { isString, isUndefined, isNull, isEmpty } from '@/shared/utils/is';
import { joinTimestamp, formatRequestDate } from './helper';
import { getToken } from '@/shared/utils/auth';
import { ADD_AJAX_ERROR_INFO } from '@/shared/store/mutation-types';
import { store } from '@/shared/store/setupStore';
import axios from 'axios';
import { AxiosRetry } from '@/shared/utils/http/axios/axiosRetry';
import { checkStatus } from './checkStatus';

const globSetting = useGlobalSetting();
const { l } = useI18n();

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform = {
    /**
     * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
     * @param {AxiosResponse<Result>} res
     * @param {RequestOptions} options
     * @returns {any}
     */
    transformResponseHook(res, options) {
        const { isTransformResponse, isReturnNativeResponse } = options;
        // 是否返回原生响应头 比如：需要获取响应头时使用该属性
        if (isReturnNativeResponse) {
            return res;
        }
        // 不进行任何处理，直接返回
        // 用于页面代码可能需要直接获取code，data，message这些信息时开启
        if (!isTransformResponse) {
            return res.data;
        }
        // 错误的时候返回
        const { data } = res;
        if (!data) {
            // return '[HTTP] Request has no return value';
            throw new Error(l('Unified.texts.sys:api:apiRequestFailed'));
        }
        //  这里 code，result，message为 后台统一的字段，需要在修改为项目自己的接口返回格式
        const { code, result, message } = data;

        // 这里逻辑可以根据项目进行修改
        const hasSuccess = data && Reflect.has(data, 'code') && code === RESULT_ENUM.SUCCESS;
        if (hasSuccess) {
            let successMsg = message;

            if (isNull(successMsg) || isUndefined(successMsg) || isEmpty(successMsg)) {
                successMsg = l(`Unified.texts.sys:api:operationSuccess`);
            }

            if (options.successMessageMode === 'modal') {
                //   createSuccessModal({ title: l('Unified.texts.sys:api:successTip'), content: successMsg });
            } else if (options.successMessageMode === 'message') {
                //   createMessage.success(successMsg);
            }
            return result;
        }

        // 在此处根据自己项目的实际情况对不同的code执行不同的操作
        // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
        let timeoutMsg = '';
        switch (code) {
            case RESULT_ENUM.TIMEOUT:
                timeoutMsg = l('Unified.texts.sys:api:timeoutMessage');
                // const userStore = UserStore.useStoreWithOut();
                // // 被动登出，带redirect地址
                // userStore.logout(false);
                break;
            default:
                if (message) {
                    timeoutMsg = message;
                }
        }

        // errorMessageMode='modal'的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
        // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
        if (options.errorMessageMode === 'modal') {
            // createErrorModal({ title: l('Unified.texts.sys:api:errorTip'), content: timeoutMsg });
        } else if (options.errorMessageMode === 'message') {
            // createMessage.error(timeoutMsg);
        }

        throw new Error(timeoutMsg || l('Unified.texts.sys:api:apiRequestFailed'));

    },
    /**
     * A function that is called before a request is sent. It can modify the request configuration as needed.
     * 在发送请求之前调用的函数。它可以根据需要修改请求配置。
     * @param {AxiosRequestConfig} config
     * @param {RequestOptions} options
     * @returns {AxiosRequestConfig}
     */
    beforeRequestHook: (config, options) => {
        const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options;

        if (joinPrefix) {
            config.url = `${urlPrefix}${config.url}`;
        }

        if (apiUrl && isString(apiUrl)) {
            config.url = `${apiUrl}${config.url}`;
        }
        const params = config.params || {};
        const data = config.data || false;
        formatDate && data && !isString(data) && formatRequestDate(data);
        if (config.method.toUpperCase() === REQUEST_ENUM.GET) {
            if (!isString(params)) {
                // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
                config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
            } else {
                // 兼容restful风格
                config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
                config.params = undefined;
            }
        } else {
            if (!isString(params)) {
                formatDate && formatRequestDate(params);
                if (
                    Reflect.has(config, 'data') &&
                    config.data &&
                    (Object.keys(config.data).length > 0 || config.data instanceof FormData)
                ) {
                    config.data = data;
                    config.params = params;
                } else {
                    // 非GET请求如果没有提供data，则将params视为data
                    config.data = params;
                    config.params = undefined;
                }
                if (joinParamsToUrl) {
                    config.url = setObjToUrlParams(
                        config.url,
                        Object.assign({}, config.params, config.data),
                    );
                }
            } else {
                // 兼容restful风格
                config.url = config.url + params;
                config.params = undefined;
            }
        }
        return config;
    },
    /**
     * @description: 请求之前的拦截器
     * @param {InternalAxiosRequestConfig} config
     * @param {CreateAxiosOptions} options
     * @returns {InternalAxiosRequestConfig}
     */
    requestInterceptors: (config, options) => {
        // 请求之前处理config
        const token = getToken();
        if (token && (config)?.requestOptions?.withToken !== false) {
            // jwt token
            (config).headers.Authorization = options.authenticationScheme
                ? `${options.authenticationScheme} ${token}`
                : token;
        }
        return config;
    },

    /**
     * @description: 请求之前的拦截器错误处理
     * @param {Error} error
     * @returns {void}
     */
    // requestInterceptorsCatch(error) {

    // },

    /**
     * @description: 响应拦截器处理
     * @param {AxiosResponse<any>} res
     * @returns {AxiosResponse<any>}
     */
    responseInterceptors: (res) => {
        return res;
    },

    /**
     * @description: 响应拦截器错误处理
     * @param {AxiosInstance} axiosInstance
     * @param {Error} error
     * @returns {void}
    */
    responseInterceptorsCatch(axiosInstance, error) {
        store.dispatch({
            type: `errorLog/${ADD_AJAX_ERROR_INFO}`,
            errInfo: error
        });
        const { response, code, message, config } = error || {};
        const errorMessageMode = config.requestOptions.errorMessageMode || 'none';
        const msg = (response && response.data && response.data.error && response.data.error.message) ? response.data.error.message : '';
        const err = (error && error.toString) ? error.toString() : '';
        let errMessage = '';

        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        try {
            if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
                errMessage = l('Unified.texts.sys:api:apiTimeoutMessage');
            }
            if (err?.includes('Network Error')) {
                errMessage = l('Unified.texts.sys:api:networkExceptionMsg');
            }

            if (errMessage) {
                if (errorMessageMode === 'modal') {
                    // createErrorModal({ title: l('Unified.texts.sys:api:errorTip'), content: errMessage });
                } else if (errorMessageMode === 'message') {
                    // createMessage.error(errMessage);
                }
                return Promise.reject(error);
            }
        } catch (error) {
            throw new Error(error);
        }

        checkStatus(error.response.status, msg, errorMessageMode);

        
        // 添加自动重试机制 保险起见 只针对GET请求
        const retryRequest = new AxiosRetry();
        console.log('retryRequest', retryRequest);
        const { isOpenRetry } = config.requestOptions.retryRequest;
        config.method.toUpperCase() === REQUEST_ENUM.GET &&
            isOpenRetry &&
            error.response.status !== 401 &&
            retryRequest.retry(axiosInstance, error);
        return Promise.reject(error);
    }
}

function createAxios(opt) {
    return new VAxios(
        // 深度合并
        deepMerge({
            // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
            // authentication schemes，e.g: Bearer
            // authenticationScheme: 'Bearer',
            authenticationScheme: '',
            // 响应超时时间设置
            timeout: 30 * 1000,
            // 基础接口地址
            baseURL: globSetting.apiUrl || '/',

            headers: { 'Content-Type': CONTENT_TYPE_ENUM.JSON },
            // 如果是form-data格式
            // headers: { 'Content-Type': CONTENT_TYPE_ENUM.FORM_URLENCODED },
            // 数据处理方式
            transform: clone(transform),
            // 配置项，下面的选项都可以在独立的接口请求中覆盖
            requestOptions: {
                // 默认将prefix 添加到url
                joinPrefix: true,
                // 是否返回原生响应头 比如：需要获取响应头时使用该属性
                isReturnNativeResponse: false,
                // 需要对返回数据进行处理
                isTransformResponse: true,
                // post请求的时候添加参数到url
                joinParamsToUrl: false,
                // 格式化提交参数时间
                formatDate: true,
                // 消息提示类型
                errorMessageMode: 'message',
                // 接口地址
                apiUrl: globSetting.apiUrl,
                // 接口拼接地址
                urlPrefix: globSetting.urlPrefix || '',
                //  是否加入时间戳
                joinTime: true,
                // 忽略重复请求
                ignoreCancelToken: true,
                // 是否携带token
                withToken: true,
                // 请求错误重试机制
                retryRequest: {
                    isOpenRetry: true,
                    count: 3,
                    waitTime: 100,
                },
            }
        }, opt || {})
    );
}

export const defHttp = createAxios();

// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//     urlPrefix: 'xxx',
//   },
// });
