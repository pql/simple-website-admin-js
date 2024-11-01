<template>
  <div @click.stop="toggleCollapsed">
    <a-icon type="double-right" v-if="getCollapsed" />
    <a-icon type="double-left" v-else />
  </div>
</template>

<script setup>
import { useMenuSetting } from "@/shared/hooks/setting/useMenuSetting";
import { defineComponent } from "vue";

defineComponent({
  name: "SiderTrigger",
});

const { getCollapsed, toggleCollapsed } = useMenuSetting();

</script>