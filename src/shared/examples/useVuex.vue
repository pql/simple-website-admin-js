<template>
  <span>use vuex</span>
</template>

<script>
import * as types from './shared/store/mutation-types';

export default {
  name: 'app',
  components: {},
  mounted() {
    console.log(this.$store);
    const locale = 'zh-Hans';
    this.$store.dispatch({
      type: `locale/${types.SET_LOCALE}`, locale
    });
    console.log(this.$store.state);
  }
}
</script>

<style></style>