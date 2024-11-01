<template>
  <ALayoutHeader :class="getHeaderClass">
    <!-- left start -->
    <div :class="`${prefixCls}-left`">
      <!-- logo -->
      <AppLogo
        v-if="getShowHeaderLogo || getIsMobile"
        :class="`${prefixCls}-logo`"
        :theme="getHeaderTheme"
        :style="getLogoWidth"
      />
      <LayoutTrigger
        v-if="
          (getShowContent &&
            getShowHeaderTrigger &&
            !getSplit &&
            !getIsMixSidebar) ||
          getIsMobile
        "
        :theme="getHeaderTheme"
        :sider="false"
      />
    </div>
    <!-- left end -->

    <!-- menu start -->

    <!-- menu end -->

    <!-- action start -->
    <div :class="`${prefixCls}-action`">
    </div>
    <!-- action end -->
  </ALayoutHeader>
</template>

<script setup>
import { Layout } from "ant-design-vue";
import { AppLogo } from "@/shared/components/Application";
import LayoutTrigger from "../trigger/index.vue";
import { useHeaderSetting } from "@/shared/hooks/setting/useHeaderSetting";
import { useMenuSetting } from "@/shared/hooks/setting/useMenuSetting";
import { useDesign } from "@/shared/hooks/web/useDesign";
import { useAppInject } from "@/shared/hooks/web/useAppInject";
import { defineComponent, unref, defineProps, inject, computed } from "vue";

defineComponent({
  name: "LayoutHeader",
  components: {
    ALayoutHeader: Layout.Header
  }
});

const props = defineProps({
  fixed: Boolean,
});

const state = inject("state");
const { getIsMobile } = useAppInject(state);
const { prefixCls } = useDesign(state, "layout-header");
const {
  getIsMixMode,
  getShowHeaderTrigger,
  getSplit,
  getIsMixSidebar,
  getMenuWidth,
} = useMenuSetting();

const { getShowContent, getHeaderTheme, getShowHeaderLogo } =
  useHeaderSetting();

const getHeaderClass = computed(() => {
  const theme = unref(getHeaderTheme);
  return [
    prefixCls,
    {
      [`${prefixCls}--fixed`]: props.fixed,
      [`${prefixCls}--mobile`]: unref(getIsMobile),
      [`${prefixCls}--${theme}`]: theme,
    },
  ];
});

const getLogoWidth = computed(() => {
  if (!unref(getIsMixMode) || unref(getIsMobile)) {
    return {};
  }
  const width = unref(getMenuWidth) < 180 ? 180 : unref(getMenuWidth);
  return { width: `${width}px` };
});

</script>

<style lang="less">
@import "./index.less";
</style>