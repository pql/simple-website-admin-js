
import { mapGetters } from 'vuex';
import { getApplicationConfig } from '@/shared/config/application';
import { defHttp } from '@/shared/utils/http/axios';
import { useI18n } from '@/shared/hooks/web/useI18n';
import { useAuthorization } from '@/shared/hooks/abp/useAuthorization';

const { l } = useI18n();
const { isGranted } = useAuthorization();

/**
 * 组件基类
 */
const SampleComponentBase = {
    data() {
        return {
            /** 加载状态 */
            loading: false,
        }
    },
    computed: {
        /** abp 配置信息 */
        ...mapGetters({
            getApplicationConfiguration: 'abp/getApplicationConfiguration',
        }),
        /** abp application configuration */
        abp() {
            return this.getApplicationConfiguration;
        },
        /** api base url */
        $apiBaseUrl() {
            /** 获取客户端基础配置信息 */
            const appConfig = getApplicationConfig();
            const { remoteServiceBaseUrl } = appConfig;
            return remoteServiceBaseUrl;
        },
        /** http request instance */
        $http() {
            return defHttp;
        },
    },
    methods: {
        /**
         * 导出 l 属性（vue-i18n $t属性 更名而来），方便依赖注入
         * @description 本地化
         * @param key 本地化键
         * @param args 本地化参数
         * @returns String
         */
        l,
        /**
         * 校验权限
         * @param {string|string[]} name 权限名称|权限名称集合
         * @param {boolean|undefined} requireAll [权限名称|权限名称集合]是否全部匹配权限集合,默认全部匹配权限集合
         * @returns {boolean}
         */
        isGranted,
    }
}

export default SampleComponentBase;