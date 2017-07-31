import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);

import client from '@/js/client.js';

const state = {
    queuemanagers : [],
    availableQueuemanagers : []
};

const getters = {
    selectableQueuemanagers(state) {
        return state.availableQueuemanagers;
    }
};

const mutations = {
    availableQueuemanagers(state, queuemanagers) {
        state.availableQueuemanagers = queuemanagers;
    },
    addQueuemanager(state, queuemanager) {
        state.queuemanagers.push({
            name : queuemanager,
            meta : null,
            status : null,
            detail : null
        });
        var removeIndex = state.availableQueuemanagers.indexOf(queuemanager);
        if (removeIndex >= 0) state.availableQueuemanagers.splice(removeIndex, 1);
    },
    status(state, payload) {
        var queuemanager = state.queuemanagers.find((qmgr) => {
            return qmgr.name == payload.meta.qmgr;
        })
        queuemanager.status = payload.data[0];
        queuemanager.meta = payload.meta;
    },
    detail(state, payload) {
        var queuemanager = state.queuemanagers.find((qmgr) => {
            return qmgr.name == payload.meta.qmgr;
        })
        queuemanager.detail = payload.data[0];
        queuemanager.meta = payload.meta;
    }
};

const actions = {
    loadAvailable(context, payload) {
        client.get('http://localhost:8081/api/mqweb/list', {
            data : payload
        }).then((response) => {
            context.commit('availableQueuemanagers', response.data.data);
        }).catch((err) => {
            console.log(err);
        });
    },
    addQueuemanager(context, payload) {
        context.commit('addQueuemanager', payload.queuemanager);
    },
    inquireQueuemanagerStatus(context, payload) {
        client.get('http://localhost:8081/api/qmstatus/inquire/' + payload.queuemanager)
            .then((response) => {
                context.commit('status', response.data);
            });
    },
    inquireQueuemanager(context, payload) {
        client.get('http://localhost:8081/api/qmgr/inquire/' + payload.queuemanager)
            .then((response) => {
                context.commit('detail', response.data);
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
