
// http:ip:port/main-out
export const mainOutRoutes = [
    {
        path: '/signin-callback',
        name: 'SignInCallback',
        component: () => import('@/views/sys/login/OidcSignInCallback.vue'),
        meta: {
            title: 'SignInCallback',
            ignoreAuth: true,
            hideMenu: true,
            hideTab: true,
            hideBreadcrumb: true,
        }
    },
    {
        path: '/signout-callback',
        name: 'SignOutCallback',
        component: () => import('@/views/sys/login/OidcSignOutCallback.vue'),
        meta: {
            title: 'SignOutCallback',
            ignoreAuth: true,
            hideMenu: true,
            hideTab: true,
            hideBreadcrumb: true,
        }
    }
];