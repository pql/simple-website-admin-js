import { Icon, message as Message, notification, Modal } from 'ant-design-vue';
import { useI18n } from '@/shared/hooks/web/useI18n';
import { isString } from '@/shared/utils/is';
import {} from 'vue';

function getIcon(iconType) {
    if(iconType === 'warning') {
        return <Icon type="info-circle" class="modal-icon-warning" />
    } else if(iconType === 'success') {
        return <Icon type="info-circle" class="modal-icon-success" />
    } else if(iconType === 'info') {
        return <Icon type="info-circle" class="modal-icon-info" />
    } else {
        return <Icon type="close-circle" class="modal-icon-error" />
    }
}

/**
 * Modal content
 * @type string | VNode | (h) => VNode
 */
function renderContent({ content }) {
    if(isString(content)) {
        return <div innerHTML={`<div>${content}</div>`}></div>;
    } else {
        return content;
    }
}

/**
 * @description: Create confirmation box
 */


function createConfirm(options) {
    const iconType = options.iconType || 'warning';
    Reflect.deleteProperty(options, 'iconType');
    const opt = {
        centered: true,
        // icon: getIcon(iconType),
        ...options,
        // content: renderContent(options),
    };
    return Modal.confirm(opt);
}

const getBaseOptions = () => {
    const { t } = useI18n();
    return {
        /**
         * Text of the OK button
         * @default 'OK'
         * @type string
         */
        okText: t('Unified.texts.common:okText'),
        /**
         * Centered Modal
         * @default false
         * @type boolean
         */
        centered: true,
    }
}

/**
 * @param {ModalOptions} options 
 * @param {string} icon 
 * @returns {ModalOptionsPartial}
 */
function createModalOptions(options, icon) {
    return {
        ...getBaseOptions(),
        ...options,
        content: renderContent(options),
        icon: getIcon(icon),
    };
}

/**
 * @param {ModalOptionsPartial} options 
 */
function createSuccessModal(options) {
    return Modal.success(createModalOptions(options, 'success'));
}

/**
 * @param {ModalOptionsPartial} options 
 */
function createErrorModal(options) {
    return Modal.error(createModalOptions(options, 'error'));
}

/**
 * @param {ModalOptionsPartial} options 
 */
function createInfoModal(options) {
    return Modal.info(createModalOptions(options, 'info'));
}

/**
 * @param {ModalOptionsPartial} options 
 */
function createWarningModal(options) {
    return Modal.warning(createModalOptions(options, 'warning'));
}

notification.config({
    placement: 'topRight',
    duration: 3,
});

/**
 * @description message
 */
export function useMessage() {
    return {
        createMessage: Message,
        notification,
        createConfirm,
        createSuccessModal,
        createErrorModal,
        createInfoModal,
        createWarningModal,
    }
}