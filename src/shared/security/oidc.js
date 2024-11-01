import Oidc from 'oidc-client';
import 'babel-polyfill';

import appConfigDev from '/public/assets/appconfig.dev.json';
import appConfigProd from '/public/assets/appconfig.prod.json';
import { isProdMode } from "@/shared/utils/env";

const appConfig = isProdMode() ? appConfigProd : appConfigDev;

console.log('appConfig:', appConfig);

const userManagerSettings = {
    /** Storage object used to persist User for currently authenticated user (default: session storage) */
    userStore: new Oidc.WebStorageStateStore(),
    /** The URL of the OIDC/OAuth2 provider */
    authority: appConfig.authorityServiceBaseUrl,
    /** Your client application's identifier as registered with the OIDC/OAuth2 */
    client_id: appConfig.avueOidcClientId,
    client_secret: '',
    /** The redirect URI of your client application to receive a response from the OIDC/OAuth2 provider */
    redirect_uri: appConfig.avueUrl,
    /** The type of response desired from the OIDC/OAuth2 provider (default: 'id_token') */
    response_type: 'code',
    /** The scope being requested from the OIDC/OAuth2 provider (default: 'openid') */
    scope: 'offline_access openid profile email phone Unified',
    /** The OIDC/OAuth2 post-logout redirect URI */
    post_logout_redirect_uri: `${location.protocol}//${location.host}/signout-callback`,
    /** The URL for the page containing the code handling the silent renew */
    silent_redirect_uri: `${location.protocol}//${location.host}/silent-renew`,
    /** The number of seconds before an access token is to expire to raise the accessTokenExpiring event (default: 60) */
    accessTokenExpiringNotificationTime: 10,
    /** Flag to indicate if there should be an automatic attempt to renew the access token prior to its expiration (default: false) */
    automaticSilentRenew: true,
    /** Should OIDC protocol claims be removed from profile (default: true) */
    filterProtocolClaims: true,
    /** Flag to control if additional identity data is loaded from the user info endpoint in order to populate the user's profile (default: true) */
    loadUserInfo: true,
}

const mgr = new Oidc.UserManager(userManagerSettings);

Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;

mgr.events.addUserLoaded(function (user) {
    console.log('New User Loaded：', arguments);
    console.log('Acess_token: ', user.access_token)
});

mgr.events.addAccessTokenExpiring(function () {
    console.log('AccessToken Expiring：', arguments);
});

mgr.events.addAccessTokenExpired(function () {
    console.log('AccessToken Expired：', arguments);
    alert('Session expired. Going out!');
    mgr.signoutRedirect().then(function (resp) {
        console.log('signed out', resp);
    }).catch(function (err) {
        console.log(err);
    });
});

mgr.events.addSilentRenewError(function () {
    console.error('Silent Renew Error: ', arguments);
});

mgr.events.addUserSignedOut(function () {
    alert('Going out!');
    console.log('UserSignedOut：', arguments);
    mgr.signoutRedirect().then(function (resp) {
        console.log('signed out', resp);
    }).catch(function (err) {
        console.log(err);
    });
});

export default class SecurityService {

    // Get mgr instance
    getIns() {
        return mgr;
    }

    // Renew the token manually
    renewToken() {
        let self = this;
        return new Promise((resolve, reject) => {
            mgr.signinSilent().then(function (user) {
                if (user == null) {
                    self.signIn(null);
                } else {
                    return resolve(user);
                }
            }).catch(function (err) {
                console.log(err);
                return reject(err);
            });
        });
    }

    // Get the user who is logged in
    getUser() {
        let self = this;
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null);
                } else {
                    return resolve(user);
                }
            }).catch(function (err) {
                console.log(err);
                return reject(err);
            });
        })
    }

    // Check if there is any user logged in
    getSignedIn() {
        let self = this;
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn();
                    return resolve(false);
                } else {
                    return resolve(true);
                }
            }).catch(function (err) {
                console.log(err);
                return reject(err);
            });
        });
    }

    // Redirect of the current window to the authorization endpoint.
    signIn() {
        mgr.signinRedirect().catch(function (err) {
            console.log(err);
        });
    }

    // Redirect of the current window to the end session endpoint
    signOut() {
        mgr.signoutRedirect().then(function (resp) {
            console.log('signed out', resp);
        }).catch(function (err) {
            console.log(err);
        });
    }

    // Get the profile of the user logged in
    getProfile() {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null)
                } else {
                    return resolve(user.profile)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }

    // Get the token id
    getIdToken() {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null)
                } else {
                    return resolve(user.id_token)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }

    // Get the session state
    getSessionState() {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null)
                } else {
                    return resolve(user.session_state)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }

    // Get the access token of the logged in user
    getAcessToken() {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null)
                } else {
                    return resolve(user.access_token)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }

    // Takes the scopes of the logged in user
    getScopes() {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null)
                } else {
                    return resolve(user.scopes)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }

    // Get the user roles logged in
    getRole() {
        let self = this;
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null);
                } else {
                    return resolve(user.profile.role);
                }
            }).catch(function (err) {
                console.log(err);
                return reject(err);
            })
        });
    }

}

export const Mgr = new SecurityService();