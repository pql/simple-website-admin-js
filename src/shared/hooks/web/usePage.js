import { PageEnum } from "@/shared/enums/page";
import { unref } from 'vue';
import { router } from '@/shared/router/setupRouter';
import { isHttpUrl } from '@/shared/utils/is';
import { openWindow } from '@/shared/utils';

function handleError(e) {
    console.error(e);
}

export const GO_TYPE = {
    REPLACE: 'replace',
    AFTER: 'after'
}

/**
 * page switch
 */
export function useGo() {
    // function go(opt?: RouteLocationRawEx): void;
    // function go(opt: RouteLocationRawEx, isReplace: boolean): void;
    // function go(opt: RouteLocationRawEx, goType: GoType): void;

    /**
     * 
     * @param {string | undefined} opt 
     * @param {boolean | 'replace' | 'after'} goTypeOrIsReplace 
     * @returns 
     */
    function go(opt = PageEnum.BASE_HOME, goTypeOrIsReplace = false) {
        if (!opt) {
            return;
        }
        let path = unref(opt);
        if (path[0] === '/') {
            path = path.slice(1);
        }
        if (isHttpUrl(path)) {
            return openWindow(path);
        }

        const isReplace = goTypeOrIsReplace === true || goTypeOrIsReplace === GO_TYPE.REPLACE;
        const isAfter = goTypeOrIsReplace === GO_TYPE.AFTER;

        if (isReplace) {
            router.replace(opt).catch(handleError);
        } else if (isAfter) {
            router.push(opt).catch(handleError);
        } else {
            router.push(opt).catch(handleError);
        }
    }
    return go;
}