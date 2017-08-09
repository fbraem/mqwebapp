import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);

import client from '@/js/client.js';

import config from 'config';

const state = {
    queues : [],
    error : null,
    meta : null
};

const getters = {
};

const mutations = {
    detail(state, payload) {
        if (payload.json.error) {
            state.queuemanager.error = payload.json.error;
            state.queuemanager = null;
        } else {
            state.queues = payload.json.data;
        }
        state.meta = payload.json.meta;
    }
};

const actions = {
    inquireQueues(context, payload) {
        client.get(config.mqweb + '/api/queue/inquire/' + payload.queuemanager)
            .then((response) => {
                context.commit('logs', {
                    meta : response.data.meta,
                    error : response.data.error
                }, { root : true });
                context.commit('detail', {
                    json : response.data
                });
            });
    }
};

export default {
    namespaced : true,
    state : state,
    getters : getters,
    mutations : mutations,
    actions : actions,
    modules: {
    }
};
