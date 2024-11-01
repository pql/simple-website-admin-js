<template>
  <Menu
    v-bind="getBindValues"
    :activeName="menuState.activeName"
    :openNames="getOpenKeys"
    :class="prefixCls"
    :activeSubMenuNames="menuState.activeSubMenuNames"
    @select="handleSelect"
  >
    <template v-for="item in items">
      <SimpleSubMenu
        :key="item.path"
        :item="item"
        :parent="true"
        :collapsedShowTitle="collapsedShowTitle"
        :collapse="collapse"
      />
    </template>
  </Menu>
</template>

<script setup>
import Menu from "./components/Menu.vue";
import SimpleSubMenu from "./SimpleSubMenu.vue";
import { useOpenKeys } from "./useOpenKeys";
import { useDesign } from "@/shared/hooks/web/useDesign";
import {
  reactive,
  toRefs,
  unref,
  ref,
  defineProps,
  defineComponent,
  defineEmits,
  useAttrs,
  inject,
  computed,
  watch,
} from "vue";
import { isHttpUrl, isFunction } from "@/shared/utils/is";
import { openWindow } from "@/shared/utils";
import { REDIRECT_NAME } from "@/shared/router/routes/constant";
import { router } from "@/shared/router/setupRouter";
import { listenerRouteChange } from "@/shared/logics/mitt/routeChange";

defineComponent({
  name: "SimpleMenu",
  inheritAttrs: false,
});

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  collapse: Boolean,
  mixSider: Boolean,
  /**
   * The theme of the current parent component
   */
  theme: { type: String, validator: (v) => ["light", "dark"].includes(v) },
  accordion: {
    type: Boolean,
    default: true,
  },
  collapsedShowTitle: Boolean,
  beforeClickFn: {
    type: Function,
  },
  isSplitMenu: Boolean,
});

const emit = defineEmits(["menuClick"]);

const attrs = useAttrs();

const currentActiveMenu = ref("");
const isClickGo = ref(false);

const menuState = reactive({
  activeName: "",
  openNames: [],
  activeSubMenuNames: [],
});

const { currentRoute } = router;
const state = inject("state");
const { prefixCls } = useDesign(state, "simple-menu");

const { items, accordion, mixSider, collapse } = toRefs(props);

const { setOpenKeys, getOpenKeys } = useOpenKeys(
  menuState,
  items,
  accordion,
  mixSider,
  collapse
);

const getBindValues = computed(() => ({ ...attrs, ...props }));

watch(
  () => props.collapse,
  (collapse) => {
    if (collapse) {
      menuState.openNames = [];
    } else {
      setOpenKeys(currentRoute.value.path);
    }
  },
  { immediate: true }
);

watch(
  () => props.items,
  () => {
    if (!props.isSplitMenu) {
      return;
    }
    setOpenKeys(currentRoute.value.path);
  },
  { flush: "post" }
);

listenerRouteChange((route) => {
  if (route.name === REDIRECT_NAME) return;

  currentActiveMenu.value = route.meta && route.meta.currentActiveMenu;
  handleMenuChange(route);

  if (unref(currentActiveMenu)) {
    menuState.activeName = unref(currentActiveMenu);
    setOpenKeys(unref(currentActiveMenu));
  }
});

async function handleMenuChange(route) {
  if (unref(isClickGo)) {
    isClickGo.value = false;
    return;
  }
  const path = (route || unref(currentRoute)).path;

  menuState.activeName = path;

  setOpenKeys(path);
}

async function handleSelect(key) {
  if (isHttpUrl(key)) {
    openWindow(key);
    return;
  }
  const { beforeClickFn } = props;
  if (beforeClickFn && isFunction(beforeClickFn)) {
    const flag = await beforeClickFn(key);
    if (!flag) return;
  }
  emit("menuClick", key);

  isClickGo.value = true;
  setOpenKeys(key);
  menuState.activeName = key;
}
</script>

<style lang="less">
@import "./index.less";
</style>