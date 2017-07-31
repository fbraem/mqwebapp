import "babel-polyfill";

import Vue from 'vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import Vuex from 'vuex';
Vue.use(Vuex);

import store from './store';

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);
import css from 'uikit/dist/css/uikit.min.css';

import SiteApp from './app.vue';

const router = new VueRouter({
    routes : [
        {
            path : '/',
            component : SiteApp
        }
    ]
});

var app = new Vue({
    router,
    store,
    data : {}
}).$mount('#mqwebApp');
