import { getAppEnvConfig } from '@/shared/utils/env';

export const useGlobalSetting = () => {
    const {
        VUE_APP_GLOB_TITLE,
        VUE_APP_GLOB_API_URL,
        VUE_APP_GLOB_API_URL_PREFIX,
        VUE_APP_GLOB_UPLOAD_URL
    } = getAppEnvConfig();

    // Take global configuration
    const glob = {
        title: VUE_APP_GLOB_TITLE,
        apiUrl: VUE_APP_GLOB_API_URL,
        shortName: VUE_APP_GLOB_TITLE.replace(/\s/g, '_').replace(/-/g, '_'),
        urlPrefix: VUE_APP_GLOB_API_URL_PREFIX,
        uploadUrl: VUE_APP_GLOB_UPLOAD_URL,
    };
    return glob;
}