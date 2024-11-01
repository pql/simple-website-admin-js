<template>
    <span>Use Sample Component Base</span>
</template>

<script>
import SampleComponentBase from '@/shared/component-base/sample-component-base';
export default {
    name: 'UseSampleComponentBase',
    mixins: [SampleComponentBase],
    mounted() {
        const granted = this.isGranted('Create');
        console.log('had "Create" Granted: ', granted);
        const translatedLanguage = this.l('AbpAccount.texts.DeleteLinkAccountConfirmationMessage', ['zhangsan']);
        console.log('translated language: ', translatedLanguage);
    }
}
</script>