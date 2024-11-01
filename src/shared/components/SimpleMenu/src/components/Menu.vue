<template>
  <ul :class="getClass">
    <slot></slot>
  </ul>
</template>

<script setup>
import {
  defineProps,
  defineEmits,
  getCurrentInstance,
  ref,
  inject,
  computed,
  provide,
  watchEffect,
  watch,
  nextTick,
  onMounted,
} from "vue";
import mitt from "mitt";
import { useDesign } from "@/shared/hooks/web/useDesign";
import { createSimpleRootMenuContext } from "./useSimpleMenuContext";

const props = defineProps({
  /**
   * The theme of the current parent component
   */
  theme: {
    type: String,
    validator: (v) => ["light", "dark"].includes(v),
    default: "light",
  },
  activeName: {
    type: [String, Number],
  },
  openNames: {
    type: Array,
    default: () => [],
  },
  accordion: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: "100%",
  },
  collapsedWidth: {
    type: String,
    default: "48px",
  },
  indentSize: {
    type: Number,
    default: 16,
  },
  collapse: {
    type: Boolean,
    default: true,
  },
  activeSubMenuNames: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["select", "open-change"]);

const rootMenuEmitter = mitt();
const instance = getCurrentInstance();

const currentActiveName = ref("");
const openedNames = ref([]);

const state = inject("state");

const { prefixCls } = useDesign(state, "menu");

const isRemoveAllPopup = ref(false);

createSimpleRootMenuContext({
  rootMenuEmitter: rootMenuEmitter,
  activeName: currentActiveName,
});

const getClass = computed(() => {
  const { theme } = props;
  return [
    prefixCls,
    `${prefixCls}-${theme}`,
    `${prefixCls}-vertical`,
    {
      [`${prefixCls}-collapse`]: props.collapse,
    },
  ];
});

watchEffect(() => {
  openedNames.value = props.openNames;
});

watchEffect(() => {
  if (props.activeName) {
    currentActiveName.value = props.activeName;
  }
});

watch(
  () => props.openNames,
  () => {
    nextTick(() => {
      updateOpened();
    });
  }
);

function updateOpened() {
  rootMenuEmitter.emit("on-update-opened", openedNames.value);
}
/**
 * @param {string | number} index
 */
function addSubMenu(name) {
  if (openedNames.value.includes(name)) return;
  openedNames.value.push(name);
  updateOpened();
}
/**
 * @param {string | number} index
 */
function removeSubMenu(name) {
  openedNames.value = openedNames.value.filter((item) => item !== name);
  updateOpened();
}

function removeAll() {
  openedNames.value = [];
  updateOpened();
}
/**
 * @param {number} index
 */
function sliceIndex(index) {
  if (index === -1) return;
  openedNames.value = openedNames.value.slice(0, index + 1);
  updateOpened();
}

provide(`subMenu:${instance.proxy._uid}`, {
  addSubMenu,
  removeSubMenu,
  getOpenNames: () => openedNames.value,
  removeAll,
  isRemoveAllPopup,
  sliceIndex,
  level: 0,
  props: props,
});

onMounted(() => {
  openedNames.value = !props.collapse ? [...props.openNames] : [];
  updateOpened();
  rootMenuEmitter.on("on-menu-item-select", (name) => {
    currentActiveName.value = name;
    nextTick(() => {
      props.collapse && removeAll();
    });
    emit("select", name);
  });

  rootMenuEmitter.on("open-name-change", ({ name, opened }) => {
    if (opened && !openedNames.value.includes(name)) {
      openedNames.value.push(name);
    } else if (!opened) {
      const index = openedNames.value.findIndex((item) => item === name);
      index !== -1 && openedNames.value.splice(index, 1);
    }
  });
});
</script>

<style lang="less">
@import "./menu.less";
</style>