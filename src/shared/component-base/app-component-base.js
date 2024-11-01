import SampleComponentBase from '@/shared/component-base/sample-component-base';
import { useMessage } from '@/shared/hooks/web/useMessage';

const { createMessage, createConfirm, notification } = useMessage();

/**
 * 组件基类
 */
const AppComponentBase = {
    mixins: [SampleComponentBase],
    data() {
        return {
            /** 保存状态 */
            saving: false,
        }
    },
    computed: {
        /** 通知服务 */
        notify() {
            return notification;
        },
        /** 消息服务 */
        message() {
            return createMessage;
        },
        /** 确认服务 */
        confirm() {
            return createConfirm;
        }
    }
}

export default AppComponentBase;