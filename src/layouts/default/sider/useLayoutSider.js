import { computed, unref, onMounted, nextTick } from 'vue';
import { useMenuSetting } from "@/shared/hooks/setting/useMenuSetting";
import { store } from '@/shared/store/setupStore';
import * as types from '@/shared/store/mutation-types';
import { TRIGGER_ENUM } from '@/shared/enums/menu';
import { useDebounceFn } from '@vueuse/core';

/**
 * Handle related operations of menu events
 */
export function useSiderEvent() {
    const getMenuSetting = useMenuSetting();

    const getCollapsedWidth = computed(() => {
        return unref(getMenuSetting.getMiniWidthNumber);
    });

    function onBreakpointChange(broken) {
        store.dispatch({
            type: `app${types.SET_PROJECT_CONFIG}`,
            config: {
                menuSetting: {
                    siderHidden: broken,
                },
            }
        });
    }

    return {
        getCollapsedWidth, onBreakpointChange
    };
}

/**
 * Handle related operations of menu folding
 * @param {Ref<boolean>} getIsMobile 
 */
export function useTrigger(getIsMobile) {
    const { getTrigger, getSplit } = useMenuSetting();

    const getShowTrigger = computed(() => {
        const trigger = unref(getTrigger);

        return (
            trigger !== TRIGGER_ENUM.NONE &&
            !unref(getIsMobile) &&
            (trigger === TRIGGER_ENUM.FOOTER || unref(getSplit))
        );
    });

    const getTriggerAttr = computed(() => {
        if (unref(getShowTrigger)) {
            return {};
        }
        return {
            trigger: null,
        };
    });

    return {
        getTriggerAttr,
        getShowTrigger
    };
}

/**
 * Handle menu drag and drop related operations
 * @param {Ref<any>} siderRef 
 * @param {Ref<any>} dragBarRef 
 * @param {boolean} mix 
 */
export function useDragLine(siderRef, dragBarRef, mix = false) {
    const { getMiniWidthNumber, getCollapsed, setMenuSetting } = useMenuSetting();
    changeWrapWidth();
    onMounted(() => {
        nextTick(() => {
            const exec = useDebounceFn(changeWrapWidth, 80);
            exec();
        });
    });

    /**
     * @param {Ref<ElRef | ComponentRef>} elRef 
     */
    function getEl(elRef) {
        const el = unref(elRef);
        if (!el) return null;
        if (Reflect.has(el, '$el')) {
            const elRefValue = unref(elRef);
            if (elRefValue && elRefValue.$el) {
                return elRefValue.$el;
            }
            return null;
        }
        return unref(elRef);
    }

    /**
     * 
     * @param {HTMLElement} ele 
     * @param {HTMLElement} wrap 
     * @param {number} clientX 
     */
    function handleMouseMove(ele, wrap, clientX) {
        document.onmousemove = function (innerE) {
            let iT = ele.left + (innerE.clientX - clientX);
            innerE = innerE || window.event;
            const maxT = 800;
            const minT = unref(getMiniWidthNumber);
            iT < 0 && (iT = 0);
            iT > maxT && (iT = maxT);
            iT < minT && (iT = minT);
            ele.style.left = wrap.style.width = iT + 'px';
            return false;
        };
    }

    /**
     * Drag and drop in the menu area-release the mouse
     * @param {any} ele 
     */
    function removeMouseup(ele) {
        const wrap = getEl(siderRef);
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            wrap.style.transition = 'width 0.2s';
            const width = parseInt(wrap.style.width);

            if (!mix) {
                const miniWidth = unref(getMiniWidthNumber);
                if (!unref(getCollapsed)) {
                    width > miniWidth + 20
                        ? setMenuSetting({ menuWidth: width })
                        : setMenuSetting({ collapsed: true });
                } else {
                    width > miniWidth && setMenuSetting({ collapsed: false, menuWidth: width });
                }
            } else {
                setMenuSetting({ menuWidth: width });
            }

            ele && ele.releaseCapture();
        };
    }

    function changeWrapWidth() {
        const ele = getEl(dragBarRef);
        if (!ele) return;
        const wrap = getEl(siderRef);
        if (!wrap) return;

        ele.onmousedown = (e) => {
            wrap.style.transition = 'unset';
            const clientX = e.clientX || 0;
            ele.left = ele.offsetLeft;
            handleMouseMove(ele, wrap, clientX);
            removeMouseup(ele);
            ele && ele.setCapture();
            return false;
        }
    }

    return {};

}