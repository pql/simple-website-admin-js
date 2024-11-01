<template>
  <AppLogo
    v-if="!(!getIsShowLogo && !getIsMobile)"
    :showTitle="!getCollapsed"
    :class="getLogoClass"
    :theme="getComputedMenuTheme"
  />
</template>

<script setup>
import { unref, inject, computed, defineProps } from "vue";
import { MENU_SPLIT_TYPE_ENUM } from "@/shared/enums/menu";
import { AppLogo } from "@/shared/components/Application";
import { useAppInject } from "@/shared/hooks/web/useAppInject";
import { useDesign } from "@/shared/hooks/web/useDesign";
import { useRootSetting } from "@/shared/hooks/setting/useRootSetting";
import { useMenuSetting } from "@/shared/hooks/setting/useMenuSetting";

const props = defineProps({
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
    default: "",
  },
});

const state = inject("state");

const { prefixCls } = useDesign(state, "layout-menu");
const { getIsMobile } = useAppInject(state);
const { getCollapsed, getIsSidebarType, getMenuTheme } = useMenuSetting();
const { getShowLogo } = useRootSetting();

const getIsShowLogo = computed(() => {
  return unref(getShowLogo) && unref(getIsSidebarType);
});

const getComputedMenuTheme = computed(() => {
  return props.theme || unref(getMenuTheme);
});

const getLogoClass = computed(() => {
  return [
    `${prefixCls}-logo`,
    unref(getComputedMenuTheme),
    {
      [`${prefixCls}--mobile`]: unref(getIsMobile),
    },
  ];
});
</script>