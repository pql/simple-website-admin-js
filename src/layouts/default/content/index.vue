<template>
  <div
    :class="[prefixCls, getLayoutContentMode]"
    ref="content"
  >
    <PageLayout />
    <BackTop v-if="getUseOpenBackTop" :target="() => content" :visibilityHeight="100" />
  </div>
</template>

<script setup>
import PageLayout from "@/layouts/page/index.vue";
import { useDesign } from "@/shared/hooks/web/useDesign";
import { useTransitionSetting } from "@/shared/hooks/setting/useTransitionSetting";
import { useRootSetting } from "@/shared/hooks/setting/useRootSetting";
import { ref, inject, defineComponent } from "vue";
import { useContentViewHeight } from "./useContentViewHeight";

import { Layout, BackTop } from "ant-design-vue";

defineComponent({
  name: "LayoutContent",
  components: {
    ALayoutContent: Layout.Content
  }
});

const state = inject("state");
const { prefixCls } = useDesign(state, "layout-content");
// const { getOpenPageLoading } = useTransitionSetting();
const { getLayoutContentMode, getPageLoading, getUseOpenBackTop } =
  useRootSetting();

useContentViewHeight();

const content = ref();
</script>

<style lang="less">
@import "@/shared/design/var/index.less";

@prefix-cls: ~"@{namespace}-layout-content";

.@{prefix-cls} {
  display: flex;
  position: relative;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  height: 0;
  min-height: 0;
  overflow: auto;

  // begin: 下面这块代码 在我的项目打包后在比较宽的屏幕(2K 31 寸)有显示 bug 有偶发性 清缓存首次进入会出现 , 刷新就没了, 这里为什么要指定宽度 ?
  &.fixed {
    width: 1200px;
    margin: 0 auto;
  }
  // end

  &-loading {
    position: absolute;
    z-index: @page-loading-z-index;
    top: 200px;
  }
}
</style>