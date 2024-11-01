<template>
  <div>
    <div :class="`${prefixCls}-dom`" :style="getDomStyle"></div>
    <div
      v-click-outside="handleClickOutside"
      :style="getWrapStyle"
      :class="[
        prefixCls,
        getMenuTheme,
        {
          open: openMenu,
          mini: getCollapsed,
        },
      ]"
      v-bind="getMenuEvents"
    >
      <AppLogo :showTitle="false" :class="`${prefixCls}-logo`" />

      <LayoutTrigger :class="`${prefixCls}-trigger`" />
    </div>
  </div>
</template>

<script>
import { useDesign } from "@/shared/hooks/web/useDesign";
import { useMenuSetting } from "@/shared/hooks/setting/useMenuSetting";
import {
  SIDE_BAR_MINI_WIDTH,
  SIDE_BAR_SHOW_TIT_MINI_WIDTH,
} from "@/shared/enums/app";
import { unref, ref } from "vue";

import {
  getChildrenMenus,
  getCurrentParentPath,
  getShallowMenus,
} from "@/shared/router/menus";
import { AppLogo } from "@/shared/components/Application";
import LayoutTrigger from "../trigger/index.vue";
// import vClickOutside from "@/shared/directives/clickOutside";
// import { ScrollContainer } from "@/shared/components/Container";

export default {
  name: "LayoutMixSider",
  components: {
    AppLogo,
    LayoutTrigger,
    // ScrollContainer,
  },
  data() {
    return {
      menuModules: ref([]),
      activePath: ref(""),
      childrenMenus: ref([]),
      openMenu: ref(false),
      currentRoute: ref(null),
    };
  },
  computed: {
    designed() {
      return useDesign(this.state, "layout-mix-sider");
    },
    prefixCls() {
      return this.designed.prefixCls;
    },
    getMenuSetting() {
      return useMenuSetting();
    },
    getMenuWidth() {
      return unref(this.getMenuSetting.getMenuWidth);
    },
    getCanDrag() {
      return unref(this.getMenuSetting.getCanDrag);
    },
    getCloseMixSidebarOnChange() {
      return unref(this.getMenuSetting.getCloseMixSidebarOnChange);
    },
    getMenuTheme() {
      return unref(this.getMenuSetting.getMenuTheme);
    },
    getMixSideFixed() {
      return unref(this.getMenuSetting.getMixSideFixed);
    },
    getMixSideTrigger() {
      return unref(this.getMenuSetting.getMixSideTrigger);
    },
    getCollapsed() {
      return unref(this.getMenuSetting.getCollapsed);
    },
    getRealWidth() {
      return unref(this.getMenuSetting.getRealWidth);
    },
    mixSideHasChildren() {
      return this.getMenuSetting.mixSideHasChildren;
    },
    getIsMixSidebar() {
      return unref(this.getMenuSetting.getIsMixSidebar);
    },
    getMixSideWidth() {
      return unref(this.getCollapsed)
        ? SIDE_BAR_MINI_WIDTH
        : SIDE_BAR_SHOW_TIT_MINI_WIDTH;
    },
    getIsFixed() {
      /* eslint-disable-next-line */
      const { mixSideHasChildren } = this.getMenuSetting;
      mixSideHasChildren.value = unref(this.childrenMenus).length > 0;
      const isFixed = unref(this.getMixSideFixed) && unref(mixSideHasChildren);
      if (isFixed) {
        /* eslint-disable-next-line */
        this.openMenu.value = true;
      }
      return isFixed;
    },
    getDomStyle() {
      const fixedWidth = unref(this.getIsFixed) ? unref(this.getRealWidth) : 0;
      const width = `${unref(this.getMixSideWidth) + fixedWidth}px`;
      return this.getWrapCommonStyle(width);
    },
    getMenuEvents() {
      return !unref(this.getMixSideFixed)
        ? {
            onmouseleave: () => {
              this.setActive(true);
              this.closeMenu();
            },
          }
        : {};
    },
  },
  methods: {
    /**
     * @param {string} width
     * @returns {CSSProperties}
     */
    getWrapCommonStyle(width) {
      return {
        width,
        maxWidth: width,
        minWidth: width,
        flex: `0 0 ${width}`,
      };
    },
    // Set the currently active menu and submenu
    async setActive(setChildren = false) {
      const path = this.currentRoute.value.path;
      if (!path) return;
      this.activePath.value = await getCurrentParentPath(path);
      if (unref(this.getIsMixSidebar)) {
        const activeMenu = unref(this.menuModules).find(
          (item) => item.path === unref(this.activePath)
        );
        const p = activeMenu.path;
        if (p) {
          const children = await getChildrenMenus(p);
          if (setChildren) {
            this.childrenMenus.value = children;

            if (unref(this.getMixSideFixed)) {
              this.openMenu.value = children.length > 0;
            }
          }
          if (children.length === 0) {
            this.childrenMenus.value = [];
          }
        }
      }
    },
    handleClickOutside() {
      this.setActive(true);
      this.closeMenu();
    },
    closeMenu() {
      if (!unref(this.getIsFixed)) {
        this.openMenu.value = false;
      }
    },
  },
};
</script>

<style lang="less">
@import "@/shared/design/var/index.less";
@prefix-cls: ~"@{namespace}-layout-mix-sider";
@width: 80px;
.@{prefix-cls} {
  position: fixed;
  z-index: @layout-mix-sider-fixed-z-index;
  top: 0;
  left: 0;
  height: 100%;
  overflow: hidden;
  transition: all 0.2s ease 0s;
  background-color: @sider-dark-bg-color;

  &-dom {
    height: 100%;
    overflow: hidden;
    transition: all 0.2s ease 0s;
  }

  &-logo {
    display: flex;
    justify-content: center;
    height: @header-height;
    padding-left: 0 !important;

    img {
      width: @logo-width;
      height: @logo-width;
    }
  }

  &.light {
    .@{prefix-cls}-logo {
      border-bottom: 1px solid rgb(238 238 238);
    }

    &.open {
      > .scrollbar {
        border-right: 1px solid rgb(238 238 238);
      }
    }

    .@{prefix-cls}-module {
      &__item {
        color: rgb(0 0 0 / 65%);
        font-weight: normal;

        &--active {
          background-color: unset;
          color: @primary-color;
        }

        &:not(&--active):hover {
          background-color: rgb(0 0 0 / 6%);
        }
      }
    }
    .@{prefix-cls}-menu-list {
      &__content {
        box-shadow: 0 0 4px 0 rgb(0 0 0 / 10%);
      }

      &__title {
        .pushpin {
          color: rgb(0 0 0 / 35%);

          &:hover {
            color: rgb(0 0 0 / 85%);
          }
        }
      }
    }
  }
  @border-color: @sider-dark-lighten-bg-color;

  &.dark {
    &.open {
      // .@{prefix-cls}-logo {
      //   border-bottom: 1px solid @border-color;
      // }

      > .scrollbar {
        border-right: 1px solid @border-color;
      }
    }
    .@{prefix-cls}-menu-list {
      background-color: @sider-dark-bg-color;

      &__title {
        border-bottom: none;
        border-bottom: 1px solid @border-color;
        color: @white;
      }
    }
  }

  > .scrollbar {
    height: calc(100% - @header-height - 38px);
  }

  &.mini &-module {
    &__name {
      display: none;
    }

    &__icon {
      margin-bottom: 0;
    }
  }

  &-module {
    position: relative;
    padding-top: 1px;

    &__item {
      position: relative;
      padding: 12px 0;
      transition: all 0.3s ease;
      color: rgb(255 255 255 / 65%);
      text-align: center;
      cursor: pointer;

      &:hover {
        color: @white;
      }
      // &:hover,
      &--active {
        background-color: @sider-dark-darken-bg-color;
        color: @white;
        font-weight: 700;

        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          background-color: @primary-color;
        }
      }
    }

    &__icon {
      margin-bottom: 8px;
      transition: all 0.2s;
      font-size: 24px;
    }

    &__name {
      margin-bottom: 0;
      transition: all 0.2s;
      font-size: 12px;
    }
  }

  &-trigger {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 36px;
    background-color: @trigger-dark-bg-color;
    color: rgb(255 255 255 / 65%);
    font-size: 14px;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
  }

  &.light &-trigger {
    border-top: 1px solid #eee;
    background-color: #fff;
    color: rgb(0 0 0 / 65%);
  }

  &-menu-list {
    position: fixed;
    top: 0;
    width: 200px;
    height: calc(100%);
    transition: all 0.2s;
    background-color: #fff;

    &__title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: @header-height;
      transition: unset;
      border-bottom: 1px solid rgb(238 238 238);
      opacity: 0;
      color: @primary-color;
      // margin-left: -6px;
      font-size: 18px;

      &.show {
        min-width: 130px;
        transition: all 0.5s ease;
        opacity: 1;
      }

      .pushpin {
        margin-right: 6px;
        color: rgb(255 255 255 / 65%);
        cursor: pointer;

        &:hover {
          color: #fff;
        }
      }
    }

    &__content {
      height: calc(100% - @header-height) !important;

      .scrollbar__wrap {
        height: 100%;
        overflow-x: hidden;
      }

      .scrollbar__bar.is-horizontal {
        display: none;
      }

      .ant-menu {
        height: 100%;
      }

      .ant-menu-inline,
      .ant-menu-vertical,
      .ant-menu-vertical-left {
        border-right: 1px solid transparent;
      }
    }
  }

  &-drag-bar {
    position: absolute;
    top: 50px;
    right: -1px;
    width: 1px;
    height: calc(100% - 50px);
    border-top: none;
    border-bottom: none;
    background-color: #f8f8f9;
    box-shadow: 0 0 4px 0 rgb(28 36 56 / 15%);
    cursor: ew-resize;
  }
}
</style>
