<template>
  <Layout :class="prefixCls">
    <LayoutHeader fixed v-if="getShowFullHeaderRef" />
    <Layout :class="[layoutClass, `${prefixCls}-out`]">
      <LayoutSideBar v-if="getShowSidebar || getIsMobile" />
      <Layout :class="`${prefixCls}-main`">
        <LayoutMultipleHeader />
        <LayoutContent />
        <LayoutFooter />
      </Layout>
    </Layout>
  </Layout>
</template>

<script setup>
import { Layout } from "ant-design-vue";
import { unref, computed, defineComponent, inject } from "vue";
import LayoutHeader from "@/layouts/default/header/index.vue";
import LayoutSideBar from "@/layouts/default//sider/index.vue";
import LayoutMultipleHeader from "@/layouts/default/header/MultipleHeader.vue";
import LayoutContent from "@/layouts/default/content/index.vue";
import LayoutFooter from "@/layouts/default/footer/index.vue";

import { useDesign } from "@/shared/hooks/web/useDesign";
import { useAppInject } from "@/shared/hooks/web/useAppInject";
import { useHeaderSetting } from "@/shared/hooks/setting/useHeaderSetting";
import { useMenuSetting } from "@/shared/hooks/setting/useMenuSetting";
import { useMultipleTabSetting } from "@/shared/hooks/setting/useMultipleTabSetting";

defineComponent({
  name: "DefaultLayout",
});

const state = inject("state");
const { prefixCls } = useDesign(state, "default-layout");
const { getIsMobile } = useAppInject(state);
const { getShowFullHeaderRef } = useHeaderSetting();
const { getShowSidebar, getIsMixSidebar, getShowMenu } = useMenuSetting();
const { getAutoCollapse } = useMultipleTabSetting();

const layoutClass = computed(() => {
  let cls = ["ant-layout"];
  if (unref(getIsMixSidebar) || unref(getShowMenu)) {
    cls.push("ant-layout-has-sider");
  }

  if (!unref(getShowMenu) && unref(getAutoCollapse)) {
    cls.push("ant-layout-auto-collapse-tabs");
  }

  return cls;
});
</script>

<style lang="less">
@import "@/shared/design/var/index.less";
@prefix-cls: ~"@{namespace}-default-layout";

.@{prefix-cls} {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: @content-bg;

  > .ant-layout {
    min-height: 100%;
  }

  &-main {
    width: 100%;
    // margin-left: 1px;
  }
}

.@{prefix-cls}-out {
  &.ant-layout-has-sider {
    .@{prefix-cls} {
      &-main {
        // margin-left: 1px;
        background-color: @app-content-background;
      }
    }
  }
}
</style>
