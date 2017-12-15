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
import QueuemanagersApp from '@/queuemanagers/queuemanagers.vue';
import QueuemanagerApp from '@/queuemanagers/queuemanager.vue';
import QueuesApp from '@/queues/queues.vue';
import QueueApp from '@/queues/queue.vue';
import MessagesApp from '@/messages/messages.vue';

const router = new VueRouter({
    routes : [
        {
            path : '/',
            component : SiteApp,
            children : [
                {
                    path : '',
                    component : QueuemanagersApp
                },
                {
                    path : '/:queuemanagerName',
                    component : QueuemanagerApp,
                    props : true
                },
                {
                    path : '/:queuemanagerName/queues',
                    component : QueuesApp,
                    props : true
                },
                {
                    path : '/:queuemanagerName/queues/:queueName',
                    component : QueueApp,
                    props : true
                },
                {
                  path : '/:queuemanagerName/messages/:queueName',
                  component : MessagesApp,
                  props : true
                }
            ]
        }
    ]
});

var app = new Vue({
    router,
    store,
    data : {}
}).$mount('#mqwebApp');
