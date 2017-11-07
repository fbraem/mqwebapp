import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);

import client from '@/js/client.js';

import config from 'config';

const state = {
    availableQueuemanagers : [],
    logs : [],
    logCount : 0
};

const getters = {
    selectableQueuemanagers(state) {
        var selectable = state.availableQueuemanagers.filter(function(name) {
            var search = state.queuemanagerModule.queuemanagers.find(function(queuemanager) {
                return queuemanager.name == name;
            });
            if (search) return false;
            return true;
        });
        return selectable;
    }
};

const mutations = {
    availableQueuemanagers(state, queuemanagers) {
        state.availableQueuemanagers = queuemanagers;
    },
    removeQueuemanagerFromAvailable(state, queuemanager) {
        var removeIndex = state.availableQueuemanagers.indexOf(queuemanager);
        if (removeIndex >= 0) state.availableQueuemanagers.splice(removeIndex, 1);
    },
    logs(state, log) {
        log.count = ++state.logCount;
        state.logs.unshift(log);
        if (state.logs.length > 10) state.logs.pop();
    }
};

const actions = {
    loadAvailable(context, payload) {
        client.get(config.mqweb + '/api/mqweb/list', {
            data : payload
        }).then((response) => {
            context.commit('availableQueuemanagers', response.data.data);
        }).catch((err) => {
            console.log(err);
        });
    },
    addQueuemanager(context, payload) {
      context.commit('removeQueuemanagerFromAvailable', payload.queuemanager);
    }
};

import QueueManagerStore from '@/queuemanagers/store.js';
import QueueStore from '@/queues/store.js'

export default new Vuex.Store({
    namespaced : true,
    state : state,
    getters : getters,
    mutations : mutations,
    actions : actions,
    modules: {
        queuemanagerModule : QueueManagerStore,
        queueModule : QueueStore
    }
});
