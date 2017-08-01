<template>
    <site>
        <div slot="content">
            <section v-if="selectableQueuemanagers.length > 0" class="uk-section uk-section-small uk-container uk-container-expand uk-section-muted">
                <div class="uk-flex-center uk-margin-remove-left" uk-grid>
                    <div>
                        <select v-model="selectedQueuemanager" class="uk-select" id="form-availableQueuemanagers">
                            <option value="">Please select a queuemanager ...</option>
                            <option v-for="name in selectableQueuemanagers" :value="name">
                                {{ name }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <button @click="addQueuemanager" class="uk-button uk-button-default" :disabled="selectedQueuemanager == ''">Add</button>
                    </div>
                </div>
            </section>
            <section class="uk-section uk-section-small uk-container uk-container-expand">
                <div v-if="queuemanagers.length == 0" class="uk-flex-center uk-margin-remove-left" uk-grid>
                    <div class="uk-alert uk-alert-warning uk-width-2-3@m">
                        Currently there are no queuemanagers selected to show on this page. Please select some queuemanagers from the list above
                        and add them to this page. When you don't see a list, contact your Websphere MQ administrator to check if MQWeb is
                        correctly configured.
                    </div>
                </div>
                <div v-else class="uk-grid">
                    <div v-for="queuemanager in queuemanagers" class="uk-width-1-1@s uk-width-1-2@m uk-width-1-4@xl">
                        <div class="uk-card uk-card-default">
                          <div class="uk-card-header">
                              <h3 class="uk-card-title">{{ queuemanager.name }}</h3>
                              <div v-if="queuemanager.detail && queuemanager.detail.QMgrDesc.value.length > 0" class="uk-text-meta">{{ queuemanager.detail.QMgrDesc.value }}</div>
                            </div>
                            <div class="uk-card-body uk-padding-small">
                              <ul class="uk-list uk-list-divider">
                                  <li>
                                      <div class="uk-grid">
                                          <div class="uk-width-expand">
                                              Status<br />
                                              <span v-if="!queuemanager.status" class="uk-text-meta">What's the status of this queuemanager?</span>
                                              <span v-else class="uk-text-meta">
                                                  <span :class="{ 'uk-text-success' : queuemanager.status.QMgrStatus.text == 'Running' }">
                                                      <span v-if="queuemanager.status.QMgrStatus.text == 'Running'" uk-icon="icon: check"></span>{{ queuemanager.status.QMgrStatus.text }}
                                                  </span>
                                                </span>
                                          </div>
                                          <div>
                                              <a class="uk-float-right" uk-icon="icon: more" @click="inquireQueuemanagerStatus(queuemanager.name)"></a>
                                          </div>
                                      </div>
                                  </li>
                                  <li>
                                      <div class="uk-grid">
                                          <div class="uk-width-expand">
                                              Queues<br />
                                              <span class="uk-text-meta">Are there queues that contain messages?</span>
                                          </div>
                                          <div>
                                              <a class="uk-float-right" uk-icon="icon: more"></a>
                                          </div>
                                      </div>
                                  </li>
                              </ul>
                              <div v-if="queuemanager.error">
                                  <div class="uk-alert uk-alert-danger uk-text-small">
                                      The MQ action failed with reason code <span class="uk-text-bold uk-text-nowrap">{{ queuemanager.error.reason.code }} - {{ queuemanager.error.reason.desc }}</span>.
                                      If the problem persists, contact your Websphere MQ administration team.
                                  </div>
                              </div>
                          </div>
                          <div class="uk-card-footer">
                              <div class="uk-grid">
                                  <div class="uk-width-expand">
                                      <span class="uk-text-meta" v-if="!queuemanager.meta">Not connected yet.</span>
                                      <span class="uk-text-meta" v-if="queuemanager.meta">
                                          Last action run on {{ formatDate(queuemanager.meta.date.start) }}
                                      </span>
                                  </div>
                                  <div>
                                      <a class="uk-float-right" uk-icon="icon: play" @click="inquireQueuemanager(queuemanager.name)"></a>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
            </section>
        </div>
    </site>
</template>

<script>
    import Site from './components/site.vue';

    import moment from 'moment';

    export default {
        components : {
            Site
        },
        data() {
            return {
                selectedQueuemanager : ""
            };
        },
        computed : {
            queuemanagers() {
                return this.$store.state.queuemanagers;
            },
            selectableQueuemanagers() {
                return this.$store.getters.selectableQueuemanagers;
            }
        },
        mounted() {
            this.$store.dispatch('loadAvailable');
        },
        methods : {
            addQueuemanager() {
                this.$store.dispatch('addQueuemanager', { queuemanager : this.selectedQueuemanager });
            },
            inquireQueuemanagerStatus(queuemanager) {
                this.$store.dispatch('inquireQueuemanagerStatus', { queuemanager : queuemanager});
            },
            inquireQueuemanager(queuemanager) {
                this.$store.dispatch('inquireQueuemanager', { queuemanager : queuemanager});
            },
            formatDate(date) {
                return moment(date).format('L LTS');
            }
        }
    }
</script>
