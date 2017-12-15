import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);

import client from '@/js/client.js';

import config from 'config';

const state = {
    queue : null,
    messages : {},
    error : null,
    meta : null
};

const getters = {
    getMessage : (state) => (id) => {
        return state.messages[id];
    },
    messages() {
        return state.messages;
    },
    error() {
      return state.error;
    }
};

const mutations = {
    init(state, payload) {
      state.messages = {};
      state.error = null;
      state.meta = null;
    },
    messages(state, payload) {
        state.messages = {};
        if (payload.json.error) {
            state.error = payload.json.error;
        } else {
            payload.json.data.forEach((message) => {
                Vue.set(state.messages, message.MsgId, message);
            })
        }
        state.meta = payload.json.meta;
    }
};

const actions = {
    init(context, payload) {
      context.commit('init');
    },
    browseMessages(context, payload) {
        context.commit('init');
        client.get(config.mqweb + '/api/message/browse/' + payload.queuemanager + '/' + payload.queue + '?Limit=100')
            .then((response) => {
                context.commit('logs', {
                    meta : response.data.meta,
                    error : response.data.error
                }, { root : true });
                context.commit('messages', {
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
