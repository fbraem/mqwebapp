import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);

import client from '@/js/client.js';

import config from 'config';

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
            detail : null,
            error : null
        });
        var removeIndex = state.availableQueuemanagers.indexOf(queuemanager);
        if (removeIndex >= 0) state.availableQueuemanagers.splice(removeIndex, 1);
    },
    status(state, payload) {
        var queuemanager = state.queuemanagers.find((qmgr) => {
            return qmgr.name == payload.queuemanager;
        });
        if (queuemanager) {
            if (payload.json.error) {
                queuemanager.error = payload.json.error;
                queuemanager.status = null;
            } else {
                queuemanager.status = payload.json.data[0];
            }
            queuemanager.meta = payload.json.meta;
        }
    },
    detail(state, payload) {
        var queuemanager = state.queuemanagers.find((qmgr) => {
            return qmgr.name == payload.queuemanager;
        });
        if (queuemanager) {
            if (payload.json.error) {
                queuemanager.error = payload.json.error;
                queuemanager.detail = null;
            } else {
                queuemanager.detail = payload.json.data[0];
            }
            queuemanager.meta = payload.json.meta;
        }
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
        context.commit('addQueuemanager', payload.queuemanager);
    },
    inquireQueuemanagerStatus(context, payload) {
        client.get(config.mqweb + '/api/qmstatus/inquire/' + payload.queuemanager)
            .then((response) => {
                context.commit('status', {
                    queuemanager : payload.queuemanager,
                    json : response.data
                });
            });
    },
    inquireQueuemanager(context, payload) {
        client.get(config.mqweb + '/api/qmgr/inquire/' + payload.queuemanager)
            .then((response) => {
                context.commit('detail', {
                    queuemanager : payload.queuemanager,
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
