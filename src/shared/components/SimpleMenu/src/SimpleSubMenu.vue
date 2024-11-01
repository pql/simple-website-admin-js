<template>
  <MenuItem
    :name="item.path"
    v-if="!menuHasChildren(item) && getShowMenu"
    v-bind="$props"
    :class="getLevelClass"
  >
    <img v-if="getImg" :src="getImg" class="w-16px h-16px align-top" />
    <a-icon v-if="getIcon" :type="getIcon" :size="16" />
    <div
      v-if="collapsedShowTitle && getIsCollapseParent"
      class="mt-1 collapse-title"
    >
      {{ getI18nName }}
    </div>
    <template #title>
      <span :class="['ml-4', `${prefixCls}-sub-title`]">
        {{ getI18nName }}
      </span>
      <SimpleMenuTag :item="item" :collapseParent="getIsCollapseParent" />
    </template>
  </MenuItem>
  <SubMenu
    :name="item.path"
    v-else-if="menuHasChildren(item) && getShowMenu"
    :class="[getLevelClass, theme]"
    :collapsedShowTitle="collapsedShowTitle"
  >
    <span>SubMenu</span>
  </SubMenu>
</template>

<script setup>
import { defineProps, inject, computed } from "vue";
import { useDesign } from "@/shared/hooks/web/useDesign";
import { useI18n } from "@/shared/hooks/web/useI18n";
import MenuItem from "./components/MenuItem.vue";
import SimpleMenuTag from "./SimpleMenuTag.vue";

const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
  parent: Boolean,
  collapsedShowTitle: Boolean,
  collapse: Boolean,
  /**
   * The theme of the current parent component
   */
  theme: {
    type: String,
    validator: (v) => ["light", "dark"].includes(v),
  },
});

const { t } = useI18n();
const state = inject("state");
const { prefixCls } = useDesign(state, "simple-menu");

const getShowMenu = computed(() => {
  let shouldShowMenu = false; // 默认值，假设hideMenu为true（即隐藏菜单）或meta不存在
  if (
    props &&
    props.item &&
    props.item.meta &&
    props.item.meta.hideMenu !== true
  ) {
    shouldShowMenu = true; // 如果hideMenu不是true，则显示菜单
  }
  return shouldShowMenu;
});

const getIcon = computed(
  () =>
    props.item && (props.item.img !== undefined ? undefined : props.item.icon)
);
const getImg = computed(() => props.item && props.item.img);

const getI18nName = computed(() => {
  return (
    t(props.item && props.item.meta && props.item.meta.title) ||
    t(props.item && props.item.name)
  );
});
const getShowSubTitle = computed(() => !props.collapse || !props.parent);
const getIsCollapseParent = computed(() => !!props.collapse && !!props.parent);
const getLevelClass = computed(() => {
  return [
    {
      [`${prefixCls}__parent`]: props.parent,
      [`${prefixCls}__children`]: !props.parent,
    },
  ];
});

/**
 * @param {Menu} menuTreeItem
 * @returns {boolean}
 * */
function menuHasChildren(menuTreeItem) {
  return (
    !!(
      menuTreeItem &&
      menuTreeItem.meta &&
      !menuTreeItem.meta.hideChildrenInMenu
    ),
    Reflect.has(menuTreeItem, "children") &&
      !!menuTreeItem.children &&
      menuTreeItem.length > 0
  );
}
</script>