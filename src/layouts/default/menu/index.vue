<template>
    <div>
        <MenuHeader v-bind="$props" />
        <MenuBody v-bind="$props" />
        <MenuFooter />
    </div>
</template>

<script>
import { unref } from 'vue';
import { useRootSetting } from '@/shared/hooks/setting/useRootSetting';
import { useMenuSetting } from "@/shared/hooks/setting/useMenuSetting";
import { MENU_SPLIT_TYPE_ENUM } from '@/shared/enums/menu';

import MenuHeader from './MenuHeader.vue';
import MenuBody from './MenuBody.vue';

const props = {
    /**
    * The theme of the current parent component
    */
    theme: { type: String, validator: (v) => ["light", "dark"].includes(v) },
    splitType: {
        type: Number,
        default: MENU_SPLIT_TYPE_ENUM.NONE,
    },
    isHorizontal: Boolean,
    // menu Mode
    menuMode: {
        type: [String, null],
        default: '',
    }
}

export default {
    name: 'LayoutMenu',
    components: {
        MenuHeader,
        MenuBody,
    },
    props,
    computed: {
        getRootSetting() {
            return useRootSetting();
        },
        getMenuSetting() {
            return useMenuSetting();
        },
        getShowLogo() {
            return unref(this.getRootSetting.getShowLogo);
        },
        getIsShowLogo() {
            return unref(this.getShowLogo);
        },
        getCollapsed() {
            return unref(this.getMenuSetting.getCollapsed);
        }
    },
}
</script>

<style lang="less">
@import "@/shared/design/var/index.less";
@prefix-cls: ~"@{namespace}-layout-menu";
@logo-prefix-cls: ~"@{namespace}-app-logo";

.@{prefix-cls} {
  &-logo {
    height: @header-height;
    padding: 10px 4px 10px 10px;

    .img {
      width: @logo-width;
      height: @logo-width;
    }
    .iitleImg {
      width: 200px;
      height: 32px;
      transition: opacity 0.5s 0.6s ease-in-out;
    }
  }

  &--mobile {
    .@{logo-prefix-cls} {
      &__title {
        opacity: 1;
      }
    }
  }
}
.left-menu-footer {
  display: flex;
  height: 50px;
  justify-content: space-around;
  align-items: center;
  margin: 0 30px;
  transition: opacity 0.6s ease-in-out;
  opacity: 1;
  overflow: hidden;
  .mx-auto {
    margin: 0;
  }
}
.ant-layout-sider-collapsed {
  .left-menu-footer {
    opacity: 0;
  }
}
</style>
