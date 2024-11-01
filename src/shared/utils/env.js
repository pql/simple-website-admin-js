import pkg from '../../../package.json';

export function getCommonStoragePrefix() {
    const { VUE_APP_GLOB_TITLE } = getAppEnvConfig();
    const value = `${VUE_APP_GLOB_TITLE.replace(/\s/g, '_')}__${getEnv()}`.toUpperCase();
    return value;
}

// Generate cache key according to version
export function getStorageShortName() {
    return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

/**
 * @description Get application environment configuration
 * @returns 
 */
export function getAppEnvConfig() {
    const {
        VUE_APP_GLOB_TITLE,
        VUE_APP_GLOB_API_URL,
        VUE_APP_GLOB_API_URL_PREFIX,
        VUE_APP_GLOB_UPLOAD_URL
    } = process.env;
    return {
        VUE_APP_GLOB_TITLE,
        VUE_APP_GLOB_API_URL,
        VUE_APP_GLOB_API_URL_PREFIX,
        VUE_APP_GLOB_UPLOAD_URL
    }
}

/**
 * @description: Development mode
 */
export const devMode = 'development';

/**
 * @description: Staging mode
 */
export const stageMode = 'staging';

/**
 * @description: Production mode
 */
export const prodMode = 'production';

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv() {
    return process.env.NODE_ENV;
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode() {
    return process.env.NODE_ENV === devMode
}

/**
 * @description: Is it a stage mode
 * @returns:
 * @example:
 */
export function isStageMode() {
    return process.env.NODE_ENV === stageMode
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode() {
    console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
    return process.env.NODE_ENV === prodMode
}
