<template>
  <templat v-if="getCommonProps.menus && getCommonProps.menus.length > 0">
    <template v-if="!props.isHorizontal">
      <SimpleMenu
        v-bind="getCommonProps"
        :isSplitMenu="getSplit"
        :items="getCommonProps.menus"
        @menuClick="handleMenuClick"
      />
    </template>
    <template v-else>
      <span>BasicMenu</span>
    </template>
  </templat>
</template>

<script setup>
import { unref, toRef, defineProps, computed } from "vue";
import { MENU_SPLIT_TYPE_ENUM } from "@/shared/enums/menu";
import { useMenuSetting } from "@/shared/hooks/setting/useMenuSetting";
import { useSplitMenu } from "./useLayoutMenu";
import { isHttpUrl } from "@/shared/utils/is";
import { openWindow } from "@/shared/utils";
import { useGo } from "@/shared/hooks/web/usePage";
import { SimpleMenu } from "@/shared/components/SimpleMenu";

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

const go = useGo();

const { getMenuTheme, getAccordion, getCollapsed, getSplit, getCollapsedShowTitle } =
  useMenuSetting();

const { menusRef } = useSplitMenu(toRef(props, "splitType"));

const getComputedMenuTheme = computed(() => props.theme || unref(getMenuTheme));

/**
 * click menu
 * @param menu
 */

function handleMenuClick(path) {
  go(path);
}

/**
 * before click menu
 * @param menu
 */
async function beforeMenuClickFn(path) {
  if (!isHttpUrl(path)) {
    return true;
  }
  openWindow(path);
  return false;
}

const getCommonProps = computed(() => {
  const menus = unref(menusRef);
  return {
    menus,
    beforeClickFn: beforeMenuClickFn,
    items: menus,
    theme: unref(getComputedMenuTheme),
    accordion: unref(getAccordion),
    collapse: unref(getCollapsed),
    collapsedShowTitle: unref(getCollapsedShowTitle),
  };
});
</script>