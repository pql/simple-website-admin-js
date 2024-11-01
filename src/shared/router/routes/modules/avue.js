import { LAYOUT } from "@/shared/router/routes/constant";

const avue = {
    path: '/avue',
    name: 'Avue',
    component: LAYOUT,
    redirect: '/avue/index',
    meta: {
        title: 'Unified.texts.Avue',
        orderNo: 2
    },
    children: [
        {
            path: 'index',
            name: 'Avue',
            component: () => import('@avue/avue-data/page/build'),
            meta: {
                title: 'Unified.texts.Avue',
            }
        }
    ]
}

export default avue;