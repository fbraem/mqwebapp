import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);

var Worker = require("worker-loader!./worker");
import config from 'config';

import client from '@/js/client.js';

const state = {
    queue : null,
		count : 0,
    messages : [],
    error : null,
    meta : null,
		worker : new Worker()
};

const getters = {
    getMessage : (state) => (id) => {
				for(var m in state.messages) {
					if (state.messages[m].mqmd.MsgId == id) {
						return state.messages[m];
					}
				}
        return null;
    },
		getMessageWithCorrelationId : (state) => (id) => {
				var messages = [];
				for(var m in state.messages) {
					if (state.messages[m].mqmd.CorrelId == id) {
						messages.push(state.messages[m]);
					}
				}
        return messages;
    },
		count(state) {
			return state.count;
		},
    messages(state) {
        return state.messages;
    },
    error(state) {
      return state.error;
    }
};

const mutations = {
    init(state, payload) {
			state.count = 0;
      state.messages = [];
      state.error = null;
      state.meta = null;
    },
    message(state, payload) {
        //state.messages = [];
        if (payload.error) {
            state.error = payload.json.error;
        } else {
						state.messages.push(payload);
						state.count++;
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
				context.state.worker.addEventListener("message", (event) => {
					context.commit('message', JSON.parse(event.data));
				});

				var url = config.ws + '/' + payload.queuemanagerName + '/' + payload.queueName;
				if (payload.limit && payload.limit > 0) {
					url += '?limit=' + payload.limit;
				}
				context.state.worker.postMessage(["start", url, payload.limit]);
/*
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
*/
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
