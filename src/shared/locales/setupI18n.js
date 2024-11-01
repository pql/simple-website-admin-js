import VueI18n from 'vue-i18n';
import { localeSetting } from '@/shared/settings/localeSetting';
import { AbpApplicationLocalizationService } from '@/shared/api/services/AbpApplicationLocalizationService';
import { store } from '@/shared/store/setupStore';

// create i18n options
const createI18nOptions = async () => {
    // get current selected locale
    const locale = store.getters['locale/getLocale'];
    // load locale messages
    const defaultLocal = await import(`./lang/${locale}.js`);
    const messages = defaultLocal.default.message || {};

    console.log('messages', messages);

    const i18nOptions = {
        locale,
        fallbackLocale: localeSetting.fallbackLocale,
        messages: { [locale]: {...messages} },
        availableLocales: localeSetting.availableLocales,
        sync: false, //If you don’t want to inherit locale from global scope, you need to set sync of i18n component option to false.
        silentTranslationWarn: true, // true - warning off
        silentFallbackWarn: true,
    }

    return i18nOptions;
}

/**
 * 合并来自接口的多语言配置信息
 * @param {VueI18n} i18n 
 */
const mergeAbpApplicationLocalization = async (i18n) => {
    // get current selected locale
    const locale = store.getters['locale/getLocale'];
    // fetch abp application localization messages
    const abpApplicationLocalization = await AbpApplicationLocalizationService.getApiAbpApplicationLocalization({
        cultureName: locale,
        onlyDynamics: false,
    });
    
    const { resources: messages } = abpApplicationLocalization;
    // 使用 mergeLocaleMessage 方法合并语言消息
    i18n.mergeLocaleMessage(locale, messages || {});
}

// setup i18n instance with glob
export let i18n = null;
const setupI18n = async () => {
    const i18nOptions = await createI18nOptions();
    i18n = new VueI18n(i18nOptions);

    mergeAbpApplicationLocalization(i18n);

    return {
     i18n
    }
}

export default setupI18n;