<template>
    <span>use axios</span>
</template>

<script>
import { defHttp } from '@/shared/utils/http/axios';
export default {
    components: {},
    mounted() {
        defHttp.request({
            url: '/api/product/queryProductList',
            method: 'get',
            params: {
                name: 'zhangsan'
            }
        }).then(res => {
            console.log('res:', res);
        }).catch(e => {
            console.log('error:', e);
        });
    }
}
</script>

<style></style>