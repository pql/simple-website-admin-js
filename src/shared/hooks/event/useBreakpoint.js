import { ref, unref, computed } from 'vue';
import { useEventListener } from '@/shared/hooks/event/useEventListener';
import { sizeEnum, screenEnum, screenMap } from '@/shared/enums/breakpoint';

// 可以用这个替换，优化项
// import { Grid } from 'ant-design-vue';
// const { useBreakpoint } = Grid;

// let globalScreenRef: ComputedRef<sizeEnum | undefined>;
// let globalWidthRef: ComputedRef<number>;
// let globalRealWidthRef: ComputedRef<number>;

let globalScreenRef;
let globalWidthRef;
let globalRealWidthRef;


// export interface CreateCallbackParams {
//     screen: ComputedRef<sizeEnum | undefined>;
//     width: ComputedRef<number>;
//     realWidth: ComputedRef<number>;
//     screenEnum: typeof screenEnum;
//     screenMap: Map<sizeEnum, number>;
//     sizeEnum: typeof sizeEnum;
// }

export function useBreakpoint() {
    return {
        screenRef: computed(() => unref(globalScreenRef)),
        widthRef: globalWidthRef,
        screenEnum,
        realWidthRef: globalRealWidthRef,
    };
}

/**
 * Just call it once
 * @param {undefined | (opt: CreateCallbackParams) => void} fn 
 */
export function createBreakpointListen(fn) {
    const screenRef = ref(sizeEnum.XL);
    const realWidthRef = ref(window.innerWidth);

    function getWindowWidth() {
        const width = document.body.clientWidth;
        const xs = screenMap.get(sizeEnum.XS);
        const sm = screenMap.get(sizeEnum.SM);
        const md = screenMap.get(sizeEnum.MD);
        const lg = screenMap.get(sizeEnum.LG);
        const xl = screenMap.get(sizeEnum.XL);

        if (width < xs) {
            screenRef.value = sizeEnum.XS;
        } else if (width < sm) {
            screenRef.value = sizeEnum.SM;
        } else if (width < md) {
            screenRef.value = sizeEnum.MD;
        } else if (width < lg) {
            screenRef.value = sizeEnum.LG;
        } else if (width < xl) {
            screenRef.value = sizeEnum.XL;
        } else {
            screenRef.value = sizeEnum.XXL;
        }
        realWidthRef.value = width;
    }

    useEventListener({
        el: window,
        name: 'resize',

        listener: () => {
            getWindowWidth();
            resizeFn();
        },
        // wait 100,
    });

    getWindowWidth();
    globalScreenRef = computed(() => unref(screenRef));
    globalWidthRef = computed(() => screenMap.get(unref(screenRef)));
    globalRealWidthRef = computed(() => unref(realWidthRef));

    function resizeFn() {
        if (typeof fn === 'function') {
            fn({
                screen: globalScreenRef,
                width: globalWidthRef,
                realWidth: globalRealWidthRef,
                screenEnum,
                screenMap,
                sizeEnum,
            });
        }
    }

    resizeFn();
    return {
        screenRef: globalScreenRef,
        screenEnum,
        widthRef: globalWidthRef,
        realWidthRef: globalRealWidthRef,
    };
}