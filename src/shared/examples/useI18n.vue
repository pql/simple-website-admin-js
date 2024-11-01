<template>
    <span>use i18n: {{ $t('common.hello', ['world']) }}</span>
</template>

<script>
import { useI18n } from '@/shared/hooks/web/useI18n';
export default {
    mounted() {
        const { l } = useI18n();
        const translated = l('Common.hello', ['world']);
        console.log(translated);
    }
}
</script>

<style></style>