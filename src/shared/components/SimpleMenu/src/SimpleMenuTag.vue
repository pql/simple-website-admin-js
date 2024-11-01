<template>
  <span :class="getTagClass" v-if="getShowTag">{{ getContent }}</span>
</template>

<script setup>
import { defineProps, inject, computed } from "vue";
import { useDesign } from "@/shared/hooks/web/useDesign";

const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
  dot: Boolean,
  collapseParent: Boolean,
});

const state = inject("state");

const { prefixCls } = useDesign(state, "simple-menu");

const getShowTag = computed(() => {
  const { item } = props;

  if (!item) return false;

  const { tag } = item;
  if (!tag) return false;

  const { dot, content } = tag;
  if (!dot && !content) return false;
  return true;
});

const getContent = computed(() => {
  if (!getShowTag.value) return "";
  const { item, collapseParent } = props;
  const { tag } = item;
  const { dot, content } = tag;
  return dot || collapseParent ? "" : content;
});

const getTagClass = computed(() => {
  const { item, collapseParent } = props;
  const { tag = {} } = item || {};
  const { dot, type = "error" } = tag;
  const tagCls = `${prefixCls}-tag`;
  return [
    tagCls,

    [`${tagCls}--${type}`],
    {
      [`${tagCls}--collapse`]: collapseParent,
      [`${tagCls}--dot`]: dot || props.dot,
    },
  ];
});
</script>