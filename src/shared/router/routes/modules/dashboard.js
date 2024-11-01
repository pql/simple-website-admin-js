import { LAYOUT } from "@/shared/router/routes/constant";

const dashboard = {
    path: '/dashboard',
    name: 'Dashboard',
    component: LAYOUT,
    redirect: '/dashboard/index',
    meta: {
        // title: 'Unified.texts.Design',
        orderNo: 1,
    },
    children: [
        {
            path: 'index',
            name: 'Dashboard',
            component: () =>import('@/views/dashboard/index') ,
            meta: {
                // title: 'Unified.texts.Design',
                // policy: 'AbpAccount'
            }
        }
    ]
}

export default dashboard;