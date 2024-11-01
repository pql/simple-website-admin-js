import { defHttp } from '@/shared/utils/http/axios';

export const AbpApplicationLocalizationService = {
    /**
     * @property {string} cultureName
     * @property {boolean|undefined} onlyDynamics
     * @returns Volo_Abp_AspNetCore_Mvc_ApplicationConfigurations_ApplicationConfigurationDto Success
     */
    getApiAbpApplicationLocalization({
        cultureName,
        onlyDynamics
    }) {
        return defHttp.request({
            method: 'GET',
            url: '/api/abp/application-localization',
            params: {
                'CultureName': cultureName,
                'OnlyDynamics': onlyDynamics,
            }
        });
    }
}