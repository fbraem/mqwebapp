import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);

import client from '@/js/client.js';

import config from 'config';

function initQueue(name) {
    return {
        name : name,
        detail : null,
        status : null
    };
};

const state = {
    queues : {},
    error : null,
    meta : null
};

const getters = {
    getQueue : (state) => (name) => {
        return state.queues[name];
    },
    isAlias : (state) => (name) => {
        var q = state.queues[name];
        return q && q.detail && q.detail.QType.text == "Alias";
    }
};

const mutations = {
    init(state, payload) {
      state.queues = {};
      state.error = null;
      state.meta = null;
    },
    queues(state, payload) {
        state.queues = {};
        if (payload.json.error) {
            state.error = payload.json.error;
        } else {
            payload.json.data.forEach((detail) => {
                var queue = initQueue(detail.QName.value);
                queue.detail = detail;
                Vue.set(state.queues, detail.QName.value, queue);
            })
        }
        state.meta = payload.json.meta;
    },
    queue(state, payload) {
        if (payload.json.error) {
            state.error = payload.json.error;
        } else {
            var queue = state.queues[payload.queuename];
            if (! queue ) {
                queue = initQueue(payload.queuename);
                Vue.set(state.queues, payload.queuename, queue);
            }
            queue.detail = payload.json.data[0];
        }
        state.meta = payload.json.meta;
    }
};

const actions = {
    init(context, payload) {
      context.commit('init');
    },
    inquireQueues(context, payload) {
        if ( context.rootGetters['queuemanagerModule/inErrorState'](payload.queuemanager) == -1 ) { // Not Connected yet;
            context.dispatch('queuemanagerModule/inquireQueuemanager', { queuemanager : payload.queuemanager }, { root : true });
        }
        if (!payload.filter || payload.filter.length ==0) {
          payload.filter = '*';
        }
        client.get(config.mqweb + '/api/queue/inquire/' + payload.queuemanager + '/' + payload.filter + '?ClusterInfo=true')
            .then((response) => {
                context.commit('logs', {
                    meta : response.data.meta,
                    error : response.data.error
                }, { root : true });
                context.commit('queues', {
                    json : response.data
                });
            });
    },
    inquireQueue(context, payload) {
        client.get(config.mqweb + '/api/queue/inquire/' + payload.queuemanager + '/' + payload.queue + '?ClusterInfo=true')
            .then((response) => {
                context.commit('logs', {
                    meta : response.data.meta,
                    error : response.data.error
                }, { root : true });
                context.commit('queue', {
                    queuename : payload.queue,
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
