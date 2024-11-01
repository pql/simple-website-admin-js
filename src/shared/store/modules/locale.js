import * as types from '@/shared/store/mutation-types';
import { LOCALE_KEY } from '@/shared/enums/cache';
import { localeSetting } from '@/shared/settings/localeSetting';
import { LOCALE } from "@/shared/enums/locale";
import { createLocalStorage } from '@/shared/utils/cache';

const ls = createLocalStorage();

const lsLocaleSetting = (ls.get(LOCALE_KEY) || localeSetting);

export default {
    namespaced: true,
    state: {
        localeConfig: lsLocaleSetting
    },
    getters: {
        getLocale(state) {
            return state.localeConfig.locale || LOCALE.EN;
        }
    },
    mutations: {
        [types.SET_LOCALE](state, { locale }) {
            state.localeConfig.locale = locale;
            ls.set(LOCALE_KEY, state.localeConfig);
        },
        [types.SET_LOCALLE_CONFIG](state, { localeConfig }) {
            state.localeConfig = { ...localeConfig };
            ls.set(LOCALE_KEY, state.localeConfig);
        }
    },
    actions: {
        [types.SET_LOCALE](context, { locale }) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit } = context;
            commit({
                type: `${types.SET_LOCALE}`,
                locale: locale
            });
        },
        /**
         * Set up multilingual information and cache
         * @param info multilingual info
         */
        [types.SET_LOCALLE_CONFIG](context, config) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit, state } = context;
            const configuration = {
                ...state.localeConfig,
                ...config
            }
            commit({
                type: `${types.SET_LOCALLE_CONFIG}`,
                localeConfig: configuration
            });
        },
        [types.INIT_LOCALE](context) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit, state } = context;
            const configuration = {
                ...localeSetting,
                ...state.localeConfig
            }
            commit({
                type: `${types.SET_LOCALLE_CONFIG}`,
                localeConfig: configuration
            });
        }
    }
}