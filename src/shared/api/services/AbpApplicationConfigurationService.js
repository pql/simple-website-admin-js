import { defHttp } from '@/shared/utils/http/axios';

export const AbpApplicationConfigurationService = {
    /**
     * @property {boolean} includeLocalizationResources
     * @returns Volo_Abp_AspNetCore_Mvc_ApplicationConfigurations_ApplicationConfigurationDto Success
     */
    getApiAbpApplicationConfiguration({
        includeLocalizationResources
    }) {
        return defHttp.request({
            method: 'GET',
            url: '/api/abp/application-configuration',
            params: {
                'IncludeLocalizationResources': includeLocalizationResources,
            }
        });
    }
}