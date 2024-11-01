<template>
  <div :class="getClass" :style="getDragBarStyle"></div>
</template>

<script setup>
import { useDesign } from "@/shared/hooks/web/useDesign";
import { useMenuSetting } from "@/shared/hooks/setting/useMenuSetting";
import { unref, inject, defineComponent, defineProps, computed } from "vue";

defineComponent({
  name: "DragBar",
});

const props = defineProps({
  mobile: Boolean,
});

const state = inject("state");

const { getMiniWidthNumber, getCollapsed, getCanDrag } = useMenuSetting();

const { prefixCls } = useDesign(state, "darg-bar");

const getDragBarStyle = computed(() => {
  if (unref(getCollapsed)) {
    return { left: `${unref(getMiniWidthNumber)}px` };
  }
  return {};
});

const getClass = computed(() => {
  return [
    prefixCls,
    {
      [`${prefixCls}--hide`]: !unref(getCanDrag) || props.mobile,
    },
  ];
});

</script>

<style lang="less" scoped>
@import "@/shared/design/var/index.less";
@prefix-cls: ~"@{namespace}-darg-bar";

.@{prefix-cls} {
  position: absolute;
  z-index: @side-drag-z-index;
  top: 0;
  right: -2px;
  width: 2px;
  height: 100%;
  border-top: none;
  border-bottom: none;
  cursor: col-resize;

  &--hide {
    display: none;
  }

  &:hover {
    background-color: @primary-color;
    box-shadow: 0 0 4px 0 rgb(28 36 56 / 15%);
  }
}
</style>
