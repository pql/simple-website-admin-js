<template>
  <div id="app">
    <ConfigProvider :locale="getAntdLocale">
      <AppProvider>
        <RouterView />
      </AppProvider>
    </ConfigProvider>
  </div>
</template>

<script>
import { unref } from "vue";
import { ConfigProvider } from "ant-design-vue";
import { AppProvider } from "@/shared/components/Application";
import { useLocale } from "@/shared/locales/useLocale";

let antdLocaleComputedRef = null;
export default {
  name: "App",
  components: {
    ConfigProvider,
    AppProvider,
  },
  created() {
    // support Multi-language
    const { getAntdLocale } = useLocale();
    antdLocaleComputedRef = getAntdLocale;
  },
  computed: {
    getAntdLocale() {
      return unref(antdLocaleComputedRef);
    },
  },
};
</script>

<style>
</style>
