<template>
  <SiderTrigger v-if="sider" />
  <HeaderTrigger v-else :theme="theme" />
</template>

<script setup>
import HeaderTrigger from "./HeaderTrigger.vue";
import SiderTrigger from "./SiderTrigger.vue";

import { defineProps, defineComponent } from "vue";

defineComponent({
    name: 'LayoutTrigger',
    components: {
        SiderTrigger,
        HeaderTrigger
    }
});

defineProps({
  /**
   * The theme of the current parent component
   */
  theme: { type: String, validator: (v) => ["light", "dark"].includes(v) },
  sider: {
    type: Boolean,
    default: true,
  },
});
</script>