<template>
    <span>OidcSignInCallback</span>
</template>

<script>
import qs from 'qs';
import SampleComponentBase from '@/shared/component-base/sample-component-base';
import { Mgr } from '@/shared/security/oidc';
import * as types from '@/shared/store/mutation-types';
import { mapGetters } from 'vuex';

// https://github.com/joaojosefilho/vuejsOidcClient/blob/master/src/App.vue
export default {
    name: 'OidcSignInCallback',
    mixins: [SampleComponentBase],
    async mounted() {
        console.log('$route: ', this.$route);
        
        const user = await Mgr.getIns().getUser();

        if(user == null) {
            const queryString = this.$route.query.redirect.split('?')[1];
            const params = qs.parse(queryString);
            console.log('URL queryString: ', queryString);
            console.log('URL search params: ',  params);

            if(params && !params.code) {
                Mgr.getIns().signinRedirect({
                    extraQueryParams: {
                        'culture': this.getLocale,
                        'ui-culture': this.getLocale
                    }
                });
            } else {
                const url = this.$route.query.redirect;
                console.log('url', url);
                const u = await Mgr.getIns().signinCallback(url);
                console.log('u', u);
                if(u != null) {
                    await this.$store.dispatch({
                        type: `user/${types.USER_LOGIN_ACTION}`,
                        user: u
                    });
                }
            }
        } else {
            console.log('currentRoute 1: ', this.$route);
            console.log('user', user);
             await this.$store.dispatch({
                type: `user/${types.USER_LOGIN_ACTION}`,
                user: user
            });
        }
    },
    computed: {
        ...mapGetters({
            getLocale: 'locale/getLocale'
        })
    }
}
</script>