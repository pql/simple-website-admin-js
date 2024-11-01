<template>
  <li
    :class="getClass"
    @click.stop="handleClickItem"
    :style="getCollapse ? {} : getItemStyle"
  >
    <Tooltip placement="right" v-if="showTooltip">
      <template #title>
        <slot name="title"></slot>
      </template>
      <div :class="`${prefixCls}-tooltip`">
        <slot></slot>
      </div>
    </Tooltip>
    <template v-else>
      <slot></slot>
      <slot name="title"></slot>
    </template>
  </li>
</template>

<script setup>
import {
  defineProps,
  getCurrentInstance,
  ref,
  unref,
  computed,
  inject,
  useSlots,
  watch,
} from "vue";
import { useMenuItem } from "./useMenu";
import { useDesign } from "@/shared/hooks/web/useDesign";
import { useSimpleRootMenuContext } from "./useSimpleMenuContext";

const props = defineProps({
  name: {
    type: [String, Number],
    required: true,
  },
  disabled: Boolean,
});

const slots = useSlots();
const instance = getCurrentInstance();
const state = inject("state");
const active = ref(false);

const { getItemStyle, getParentList, getParentMenu, getParentRootMenu } =
  useMenuItem(instance);

const { prefixCls } = useDesign(state, "menu");

const { rootMenuEmitter, activeName } = useSimpleRootMenuContext();

const getCollapse = computed(
  () => unref(getParentRootMenu) && unref(getParentRootMenu).props.collapse
);

const showTooltip = computed(() => {
  return (
    unref(getParentMenu) &&
    unref(getParentMenu).type.name === "Menu" &&
    unref(getCollapse) &&
    slots.title
  );
});

function handleClickItem() {
  const { disabled } = props;
  if (disabled) {
    return;
  }

  rootMenuEmitter.emit("on-menu-item-select", props.name);
  if (unref(getCollapse)) {
    return;
  }
  const { uidList } = getParentList();

  rootMenuEmitter.emit("on-update-opened", {
    opend: false,
    parent: instance.parent || null,
    uidList: uidList,
  });
}

watch(
  () => activeName.value,
  (name) => {
    if (name === props.name) {
      const { list, uidList } = getParentList();
      active.value = true;
      list.forEach((item) => {
        if (item.proxy) {
          item.proxy.active = true;
        }
      });

      rootMenuEmitter.emit("on-update-active-name:submenu", uidList);
    } else {
      active.value = false;
    }
  },
  { immediate: true }
);
</script>