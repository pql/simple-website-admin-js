import PageLayout from "@/layouts/page/index.vue";

const controlPanel = {
    path: '/control-panel',
    name: 'ControlPanel',
    component: PageLayout,
    redirect: '/control-panel/design/build',
    meta: {
        title: 'Unified.texts.ControlPanel',
        orderNo: 3,
    },
    children: [
        {
            path: 'design/build',
            name: 'Build',
            component: () => import('@/views/page/build.vue'),
            meta: {
                title: 'Unified.texts.ControlPanelDesign',
            }
        },
        {
            path: 'design/build/:id',
            name: 'Build',
            component: () => import('@/views/page/build.vue'),
            meta: {
                title: 'Unified.texts.Build',
                // policy: 'AbpAccount',
            }
        }
    ]
}


export default controlPanel;