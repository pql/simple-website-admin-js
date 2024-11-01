import { computed, unref } from 'vue';

import { default as antd_zh_cn } from 'ant-design-vue/es/locale/zh_CN';
import { default as antd_en_us} from 'ant-design-vue/es/locale/en_US';

import { i18n } from "@/shared/locales/setupI18n";
import { store } from '@/shared/store/setupStore';

import { LOCALE } from "@/shared/enums/locale";

export function useLocale() {
    const getLocale = computed(() => store.getters['locale/getLocale']);
    const getAntdLocale = computed(() => {
        if(unref(getLocale) === LOCALE.EN) {
            return antd_en_us || {};
        } else {
            return antd_zh_cn || {};
        }
    });

    return {
        getLocale,
        getAntdLocale,
    }
}