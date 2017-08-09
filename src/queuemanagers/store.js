import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);

import Lockr from 'lockr';

import client from '@/js/client.js';

import config from 'config';

function initQueuemanager(name) {
    return {
        name : name,
        meta : null,
        status : null,
        detail : null,
        error : null
    };
}

const state = {
    queuemanagers : []
};

const getters = {
    inErrorState: (state) => (name) => {
        // 0 = OK, 1 = Error, -1 = no connection yet
        var queuemanager = state.queuemanagers.find(function(queuemanager) {
            return queuemanager.name == name;
        });
        if (queuemanager) {
            if (queuemanager.meta == null) return -1;
            if (queuemanager.error == null) return 0;
            return 1;
        }
        return -1;
    },
    getQueuemanager : (state) => (name) => {
        var queuemanager = state.queuemanagers.find(function(queuemanager) {
            return queuemanager.name == name;
        });
        return queuemanager;
    }
};

const mutations = {
    queuemanagers(state, queuemanagers) {
        queuemanagers.forEach(function(queuemanager) {
            state.queuemanagers.push(initQueuemanager(queuemanager));
        });
    },
    addQueuemanager(state, queuemanager) {
        state.queuemanagers.push(initQueuemanager(name));
        var removeIndex = state.availableQueuemanagers.indexOf(queuemanager);
        if (removeIndex >= 0) state.availableQueuemanagers.splice(removeIndex, 1);

        var localStorageQueuemanagers = state.queuemanagers.map(function(queuemanager) {
          return queuemanager.name;
        });
        Lockr.set('queuemanagers', localStorageQueuemanagers);
    },
    status(state, payload) {
        var queuemanager = state.queuemanagers.find((qmgr) => {
            return qmgr.name == payload.queuemanager;
        });
        if (queuemanager == null) {
            queuemanager = initQueuemanager(payload.queuemanager);
            state.queuemanagers.push(queuemanager);
        }
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
        if (queuemanager == null) {
            queuemanager = initQueuemanager(payload.queuemanager);
            state.queuemanagers.push(queuemanager);
        }
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
    inquireQueuemanagerStatus(context, payload) {
        client.get(config.mqweb + '/api/qmstatus/inquire/' + payload.queuemanager)
            .then((response) => {
                context.commit('logs', {
                    meta : response.data.meta,
                    error : response.data.error
                }, { root : true });
                context.commit('status', {
                    queuemanager : payload.queuemanager,
                    json : response.data
                });
            });
    },
    inquireQueuemanager(context, payload) {
        client.get(config.mqweb + '/api/qmgr/inquire/' + payload.queuemanager)
            .then((response) => {
                context.commit('logs', {
                    meta : response.data.meta,
                    error : response.data.error
                }, { root : true });
                context.commit('detail', {
                    queuemanager : payload.queuemanager,
                    json : response.data
                });
            });
    },
    addQueuemanager(context, payload) {
        context.commit('addQueuemanager', payload.queuemanager);
    },
    loadQueuemanagers(context, payload) {
      var queuemanagers = Lockr.get('queuemanagers', []);
      context.commit('queuemanagers', queuemanagers);
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
