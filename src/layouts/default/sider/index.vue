<template>
  <div>
    <Drawer
      v-if="getIsMobile"
      placement="left"
      :class="prefixCls"
      :width="getMenuWidth"
      :getContainer="false"
      :visible="!getCollapsed"
      @close="handleClose"
    >
      <Sider />
    </Drawer>
    <MixSider v-else-if="getIsMixSidebar" />
    <Sider v-else />
  </div>
</template>

<script setup>
import { Drawer } from "ant-design-vue";
import Sider from "./LayoutSider.vue";
import MixSider from "./MixSider";

import { useDesign } from "@/shared/hooks/web/useDesign";
import { useAppInject } from "@/shared/hooks/web/useAppInject";
import { useMenuSetting } from "@/shared/hooks/setting/useMenuSetting";
import { unref, defineComponent, inject } from "vue";

defineComponent({
  name: "SiderWrapper",
});

const state = inject("state");
const { prefixCls } = useDesign(state, "layout-sider-wrapper");
const { getIsMobile } = useAppInject(state);
const { setMenuSetting, getCollapsed, getMenuWidth, getIsMixSidebar } =
  useMenuSetting();

function handleClose() {
  setMenuSetting({
    collapsed: true,
  });
}
</script>

<style lang="less">
@import "@/shared/design/var/index.less";
@prefix-cls: ~"@{namespace}-layout-sider-wrapper";

.@{prefix-cls} {
  .ant-drawer-body {
    height: 100vh;
    padding: 0;
  }

  .ant-drawer-header-no-title {
    display: none;
  }
}
</style>
