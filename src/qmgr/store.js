import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);

import client from '@/js/client.js';

import config from 'config';

const state = {
    queuemanager : null,
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
            state.queuemanager = payload.json.data[0];
        }
        state.meta = payload.json.meta;
        console.log(state.queuemanager);
    }
};

const actions = {
    inquireQueuemanager(context, payload) {
        client.get(config.mqweb + '/api/qmgr/inquire/' + payload.queuemanager)
            .then((response) => {
                context.commit('detail', {
                    json : response.data
                });
            });
    }
};

export default new Vuex.Store({
    namespaced : true,
    state : state,
    getters : getters,
    mutations : mutations,
    actions : actions,
    modules: {
    }
});
