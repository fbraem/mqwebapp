import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);

import client from '@/js/client.js';

import config from 'config';

const state = {
    queue : null,
    messages : [],
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
    message(state, payload) {
        //state.messages = [];
        if (payload.error) {
            state.error = payload.json.error;
        } else {
						state.messages.push(payload);
        }
				//TODO: // Add meta to browse
        //state.meta = payload.json.meta;
    }
};

const actions = {
    init(context, payload) {
      context.commit('init');
    },
    browseMessages(context, payload) {
        context.commit('init');
        client.get(config.mqweb + '/api/message/browse/' + payload.queuemanager + '/' + payload.queue + '?Limit=' + payload.limit)
            .then((response) => {
                context.commit('logs', {
                    meta : response.data.meta,
                    error : response.data.error
                }, { root : true });
                context.commit('messages', {
                    json : response.data
                });
            });
    },
		handleMessage(context, payload) {
			context.commit('message', payload);
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
