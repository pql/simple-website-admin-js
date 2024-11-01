<template>
  <Layout.Footer :class="prefixCls" v-if="getShowLayoutFooter" ref="footerRef">
    <div>LayoutFooter</div>
  </Layout.Footer>
</template>

<script setup>
import { Layout } from "ant-design-vue";
import { useRootSetting } from "@/shared/hooks/setting/useRootSetting";
import { unref, computed, inject } from "vue";
import { useDesign } from "@/shared/hooks/web/useDesign";
import { useI18n } from "@/shared/hooks/web/useI18n";
import { router } from "@/shared/router/setupRouter";

const { l } = useI18n();
const { getShowFooter } = useRootSetting();
const { currentRoute } = router;
const state = inject("state");
const { prefixCls } = useDesign(state, "layout-footer");

const getShowLayoutFooter = computed(() => {
  var currentRouteValue = unref(currentRoute);
  var hiddenFooter =
    currentRouteValue && currentRouteValue.meta
      ? currentRouteValue.meta.hiddenFooter
      : undefined;
  var result = hiddenFooter === undefined || !hiddenFooter;
  return unref(getShowFooter) && result;
});
</script>

<style lang="less" scoped>
@import "@/shared/design/var/index.less";
@prefix-cls: ~"@{namespace}-layout-footer";

@normal-color: rgba(0, 0, 0, 0.45);

@hover-color: rgba(0, 0, 0, 0.85);

.@{prefix-cls} {
  // 页脚固定高度
  height: 75px;
  color: @normal-color;
  text-align: center;

  &__links {
    margin-bottom: 8px;

    a {
      color: @normal-color;

      &:hover {
        color: @hover-color;
      }
    }
  }

  &__github {
    margin: 0 30px;

    &:hover {
      color: @hover-color;
    }
  }
}
</style>
