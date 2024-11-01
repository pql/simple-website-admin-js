<template>
  <div>
    <RouterView>
      <template #default="{ Component, route }">
        <transition
          :name="
            getTransitionName({
              route,
              openCache,
              enableTransition: getEnableTransition,
              cacheTabs: getCaches,
              def: getBasicTransition,
            })
          "
          mode="out-in"
          appear
        >
          <keep-alive v-if="openCache" :include="getCaches">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
          <component v-else :is="Component" :key="route.fullPath" />
        </transition>
      </template>
    </RouterView>
    <FrameLayout v-if="getCanEmbedIFramePage" />
  </div>
</template>

<script setup>
import FrameLayout from "@/layouts/iframe/index.vue";
import { useRootSetting } from "@/shared/hooks/setting/useRootSetting";
import { useTransitionSetting } from "@/shared/hooks/setting/useTransitionSetting";
import { getTransitionName } from "./transition";
import { unref, defineComponent, computed } from "vue";

defineComponent({
  name: "PageLayout",
});

const { getOpenKeepAlive, getCanEmbedIFramePage } = useRootSetting();

const { getBasicTransition, getEnableTransition } = useTransitionSetting();

const openCache = computed(() => unref(getOpenKeepAlive));

const getCaches = computed(() => {
  if (!unref(getOpenKeepAlive)) {
    return [];
  }
  return [];
});
</script>