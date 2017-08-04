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

import QueuemanagerApp from './app.vue';
import NotFound from '@/site/components/notfound.vue';

const router = new VueRouter({
    routes : [
        {
            path : '/:name',
            component : QueuemanagerApp,
            props : true
        },
        {
            path : '*',
            component : NotFound,
            props : {
                message : 'No queuemanager specified!'
            }
        }
    ]
});

var app = new Vue({
    router,
    store,
    data : {}
}).$mount('#mqwebApp');
