<script>
import { toRefs, ref, unref } from "vue";
import { prefixCls } from "@/shared/settings/designSetting";
import { createAppProviderContext } from "./useAppContext";
import { createBreakpointListen } from "@/shared/hooks/event/useBreakpoint";
import { store } from "@/shared/store/setupStore";
import * as types from "@/shared/store/mutation-types";
import { MENU_TYPE_ENUM, MENU_MODE_ENUM } from "@/shared/enums/menu";

const props = {
  /**
   * class style prefix
   */
  prefixCls: { type: String, default: prefixCls },
};

export default {
  name: "AppProvider",
  inheritAttrs: false,
  props,
  provide: () => {
    const isMobile = ref(false);
    const isSetState = ref(false);

    // Monitor screen breakpoint information changes
    createBreakpointListen(({ screenMap, sizeEnum, width }) => {
      const lgWidth = screenMap.get(sizeEnum.LG);
      if (lgWidth) {
        isMobile.value = width.value - 1 < lgWidth;
      }
      handleRestoreState();
    });

    /**
     * Used to maintain the state before the window changes
     */
    function handleRestoreState() {
      if (unref(isMobile)) {
        if (!unref(isSetState)) {
          isSetState.value = true;
          const projectSetting = store.getters["app/getProjectConfig"];
          const {
            menuSetting: {
              type: menuType,
              mode: menuMode,
              collapsed: menuCollapsed,
              split: menuSplit,
            },
          } = projectSetting;

          store.dispatch({
            type: `app/${types.SET_PROJECT_CONFIG}`,
            config: {
              menuSetting: {
                type: MENU_TYPE_ENUM.SIDEBAR,
                mode: MENU_MODE_ENUM.INLINE,
                split: false,
              },
            },
          });

          store.commit({
            type: `app/${types.SET_BEFORE_MINI_INFO}`,
            info: {
              menuMode,
              menuCollapsed,
              menuType,
              menuSplit,
            },
          });
        }
      } else {
        if(unref(isSetState)) {
          isSetState.value = false;
          const getBeforeMiniInfo = store.getters['app/getBeforeMiniInfo'];
          const { menuMode, menuCollapsed, menuType, menuSplit } = getBeforeMiniInfo;
          store.dispatch({
            type: `app/${types.SET_PROJECT_CONFIG}`,
            config: {
              menuSetting: {
                type: menuType,
                mode: menuMode,
                collapsed: menuCollapsed,
                split: menuSplit,
              },
            },
          });
        }
      }
    }

    // Inject variables into the global
    const { prefixCls } = toRefs(props);
    return createAppProviderContext({ prefixCls, isMobile });
  },
  render() {
    return this.$slots.default;
  },
};
</script>