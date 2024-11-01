<template>
  <Scrollbar ref="scrollbarRef" :scrollHeight="scrollHeight" v-bind="$attrs">
    <slot></slot>
  </Scrollbar>
</template>

<script>
import { Scrollbar } from "@/shared/components/Scrollbar";

const props = {
  scrollHeigh: {
    type: Number,
  },
};
export default {
  name: "ScrollContainer",
  props,
  components: {
    Scrollbar,
  },
};
</script>

<style lang="less">
  .scroll-container {
    width: 100%;
    height: 100%;

    .scrollbar__wrap {
      margin-bottom: 18px !important;
    }

    .scrollbar__view {
      box-sizing: border-box;
    }
  }
</style>