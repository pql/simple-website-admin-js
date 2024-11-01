<template>
    <div>
        <a-button @click="onHandleMessage">Message</a-button>
        <a-button @click="onHandleConfirm">Confirm</a-button>
        <a-button @click="onHandleNotify">Notification</a-button>
    </div>
</template>

<script>
import AppComponentBase from "@/shared/component-base/app-component-base";

export default {
    mixins: [AppComponentBase],
    methods: {
        onHandleMessage() {
            console.log('message');
            this.message.success('success');
            this.message.warning('warning');
            this.message.info('info');
            this.message.error('error');
        },
        onHandleConfirm() {
            console.log('confirm');
            this.confirm({
                title: 'Confirm',
                content: 'Bla bla ...',
                okText: '确认',
                cancelText: '取消',
            });
        },
        onHandleNotify() {
            console.log('notify');
            this.notify.info({
                message: 'message',
                description: 'description'
            });
        }
    }
}
</script>
