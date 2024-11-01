import * as types from '@/shared/store/mutation-types';
import { AbpApplicationConfigurationService } from '@/shared/api/services/AbpApplicationConfigurationService';
import { createLocalStorage } from '@/shared/utils/cache'
import { ABP_APP_KEY } from '@/shared/enums/cache';

const ls = createLocalStorage();
const defaultApplicationConfiguration = {};
const lsApplicationConfiguration = ls.get(ABP_APP_KEY) || defaultApplicationConfiguration;

export default {
    namespaced: true,
    state: {
        applicationConfiguration: lsApplicationConfiguration
    },
    getters: {
        getApplicationConfiguration(state) {
            return state.applicationConfiguration || defaultApplicationConfiguration;
        },
        getCurrentUser(state) {
            return state.applicationConfiguration.currentUser || null;
        }
    },
    mutations: {
        [types.SET_ABP_APPLICATION_CONFIGURATION](state, { config }) {
            state.applicationConfiguration = config;
            ls.set(ABP_APP_KEY, config);
        }
    },
    actions: {
        async [types.INIT_ABP_APPLICATION_CONFIGURATION](context) {
            // const { commit, state, rootState, getters, rootGetters, dispatch } = context;
            const { commit, state } = context;

            const applicationConfiguration = await AbpApplicationConfigurationService.getApiAbpApplicationConfiguration({
                includeLocalizationResources: false
            });

            commit({
                type: `${types.SET_ABP_APPLICATION_CONFIGURATION}`,
                config: {
                    ...state.applicationConfiguration,
                    ...applicationConfiguration || {}
                }
            });
        }
    }
}