import { router } from '@/shared/router/setupRouter';
import { uniqBy } from 'lodash';

export function useFrameKeepAlive() {
    const { currentRoute } = router;

    const getFramePages = getAllFramePages(router.options.routes) || [];

    function getAllFramePages(routes) {
        let res = [];
        for (const route of routes) {
            const { meta: { frameSrc } = {}, children } = route;
            if (frameSrc) {
                res.push(route);
            }
            if (children && children.length) {
                res.push(...getAllFramePages(children));
            }
        }
        res = uniqBy(res, 'name');
        return res;
    }

    function showIframe(item) {
        return item.name === currentRoute.name;
    }

    return {
        getFramePages,
        showIframe
    }
}