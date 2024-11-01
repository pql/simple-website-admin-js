<template>
  <div>
    <div
      v-if="getMenuFixed && !getIsMobile"
      v-show="showClassSideBarRef"
      :style="getHiddenDomStyle"
    ></div>
    <!-- 
        针对场景：菜单折叠按钮为“底部”时：
        关于 breakpoint，
        组件定义的是 lg: '992px'，
        而 vben 定义的是 lg: '960px'，
        现把组件的 breakpoint 设为 md，
        则组件的 md: '768px' < vben的 lg: '960px'，
        防止 collapsedWidth 在 960px ~ 992px 之间错误设置为 0，
        从而防止出现浮动的 trigger（且breakpoint事件失效）
    -->
    <ALayoutSider
      ref="sideRef"
      v-show="showClassSideBarRef"
      :breakpoint="getBreakpoint"
      collapsible
      :class="getSiderClass"
      :width="getMenuWidth"
      :collapsed="getCollapsed"
      :collapsedWidth="getCollapsedWidth"
      :theme="getMenuTheme"
      :trigger="triggerVNode"
      v-bind="getTriggerAttr"
      @breakpoint="onBreakpointChange"
    >
      <template v-if="getShowTrigger" #trigger>
        <LayoutTrigger />
      </template>
      <LayoutMenu
        :theme="getMenuTheme"
        :menuMode="getMode"
        :splitType="getSplitType"
      />
      <DragBar ref="dragBarRef" />
    </ALayoutSider>
  </div>
</template>

<script setup>
import { Layout } from "ant-design-vue";
import { unref, h, inject, defineComponent, ref, computed } from "vue";
import { useMenuSetting } from "@/shared/hooks/setting/useMenuSetting";
import LayoutMenu from "@/layouts/default/menu/index.vue";
import LayoutTrigger from "@/layouts/default/trigger/index.vue";
import {
  MENU_SPLIT_TYPE_ENUM,
  MENU_MODE_ENUM,
  TRIGGER_ENUM,
} from "@/shared/enums/menu";
import { useDesign } from "@/shared/hooks/web/useDesign";
import { useAppInject } from "@/shared/hooks/web/useAppInject";
import { useSiderEvent, useTrigger, useDragLine } from "./useLayoutSider";
import DragBar from "./DragBar.vue";

defineComponent({
  name: "LayoutSideBar",
  components: {
    ALayoutSider: Layout.Sider
  }
});

const dragBarRef = ref(null);
const sideRef = ref(null);

const {
  getCollapsed,
  getMenuWidth,
  getSplit,
  getMenuTheme,
  getRealWidth,
  getMenuHidden,
  getMenuFixed,
  getIsMixMode,
  getTrigger,
} = useMenuSetting();
const state = inject("state");
const { prefixCls } = useDesign(state, "layout-sideBar");

const { getIsMobile } = useAppInject(state);

const { getTriggerAttr, getShowTrigger } = useTrigger(getIsMobile);

useDragLine(sideRef, dragBarRef);

const { getCollapsedWidth, onBreakpointChange } = useSiderEvent();

const getMode = computed(() => {
  return unref(getSplit) ? MENU_MODE_ENUM.INLINE : null;
});

const getSplitType = computed(() => {
  return unref(getSplit)
    ? MENU_SPLIT_TYPE_ENUM.LEFT
    : MENU_SPLIT_TYPE_ENUM.NONE;
});

const showClassSideBarRef = computed(() => {
  return unref(getSplit) ? !unref(getMenuHidden) : true;
});

const getSiderClass = computed(() => {
  return [
    prefixCls,
    {
      [`${prefixCls}--fixed`]: unref(getMenuFixed),
      [`${prefixCls}--mix`]: unref(getIsMixMode) && !unref(getIsMobile),
    },
  ];
});

const getHiddenDomStyle = computed(() => {
  const width = `${unref(getRealWidth)}px`;
  return {
    width,
    overflow: "hidden",
    flex: `0 0 ${width}`,
    maxWidth: width,
    minWidth: width,
    transition: "all 0.2s",
  };
});

const getBreakpoint = computed(() => {
    return unref(getTrigger) === TRIGGER_ENUM.FOOTER ? "md" : "lg";
});

// 在此处使用计算量可能会导致sider异常
// andv 更新后，如果trigger插槽可用，则此处代码可废弃
const triggerVNode = h(LayoutTrigger);
</script>

<style lang="less">
@import "@/shared/design/var/index.less";

@prefix-cls: ~"@{namespace}-layout-sideBar";
.@{prefix-cls} {
  z-index: @layout-sider-fixed-z-index;
  border-right: 1px solid @border-color-light;

  &--fixed {
    position: fixed !important;
    top: 0;
    left: 0;
    height: 100%;
  }

  &--mix {
    top: @header-height;
    height: calc(100% - @header-height);
  }

  &.ant-layout-sider-dark {
    background-color: @sider-dark-bg-color;

    .ant-layout-sider-trigger {
      background-color: @trigger-dark-bg-color;
      color: darken(@white, 25%);

      &:hover {
        background-color: @trigger-dark-hover-bg-color;
        color: @white;
      }
    }
  }

  &:not(.ant-layout-sider-dark) {
    // box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);

    .ant-layout-sider-trigger {
      border-top: 1px solid @border-color-light;
      color: @text-color-base;
    }
  }

  .ant-layout-sider-zero-width-trigger {
    z-index: 10;
    top: 40%;
  }

  & .ant-layout-sider-trigger {
    height: 36px;
    line-height: 36px;
  }
}
</style>