<template>
  <span :class="[prefixCls, theme]" @click="toggleCollapsed">
    <a-icon type="menu-unfold" v-if="getCollapsed" />
    <a-icon type="menu-fold" v-else />
  </span>
</template>

<script setup>
import { useDesign } from "@/shared/hooks/web/useDesign";
import { useMenuSetting } from "@/shared/hooks/setting/useMenuSetting";
import { unref, inject, defineProps } from "vue";

const props = defineProps({
  /**
   * The theme of the current parent component
   */
  theme: { type: String, validator: (v) => ["light", "dark"].includes(v) },
});

const state = inject("state");

const { prefixCls } = useDesign(state, "layout-header-trigger");

const { getCollapsed, toggleCollapsed } = useMenuSetting();
</script>