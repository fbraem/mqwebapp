import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);

import client from '@/js/client.js';

import config from 'config';

const state = {
    availableQueuemanagers : []
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
    addQueuemanager(state, queuemanager) {
        var removeIndex = state.availableQueuemanagers.indexOf(queuemanager);
        if (removeIndex >= 0) state.availableQueuemanagers.splice(removeIndex, 1);
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
