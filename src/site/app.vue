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
                <div v-else class="uk-grid-match" uk-grid>
                    <div v-for="queuemanager in queuemanagers" class="uk-width-1-1@s uk-width-1-2@m uk-width-1-4@xl">
                        <div class="uk-card uk-card-default">
                            <div v-if="inErrorState(queuemanager.name) == 1" style="display:table;width:100%;border:1px solid #ddd;border-top:0">
                                <span style="display:table-cell;line-height:8px;width:100%;background-color:red;text-indent:-9999px">ERROR</span>
                            </div>
                            <div v-if="inErrorState(queuemanager.name) == 0" style="display:table;width:100%;border:1px solid #ddd;border-top:0">
                                <span style="display:table-cell;line-height:8px;width:100%;background-color:green;text-indent:-9999px">ERROR</span>
                            </div>
                            <div class="uk-card-header">
                                <h3 class="uk-card-title">{{ queuemanager.name }}</h3>
                                <div v-if="queuemanager.detail" class="uk-card-badge uk-label">{{ queuemanager.detail.Platform.text }}</div>
                                <div v-if="queuemanager.detail && queuemanager.detail.QMgrDesc.value.length > 0" class="uk-text-meta">{{ queuemanager.detail.QMgrDesc.value }}</div>
                            </div>
                            <div class="uk-card-body uk-padding-small">
                              <ul class="uk-list uk-list-divider">
                                  <li>
                                      <detail :queuemanager="queuemanager"></detail>
                                  </li>
                                  <li>
                                      <status :queuemanager="queuemanager"></status>
                                  </li>
                                  <li>
                                      <div uk-grid>
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
                              <mqerror v-if="queuemanager.error" :error="queuemanager.error"></mqerror>
                          </div>
                          <div class="uk-card-footer">
                              <div uk-grid>
                                  <div class="uk-width-expand">
                                      <span class="uk-text-meta" v-if="!queuemanager.meta">Not connected yet.</span>
                                      <span class="uk-text-meta" v-if="queuemanager.meta">
                                          Last action run on {{ formatDate(queuemanager.meta.date.start) }}
                                      </span>
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
    import Detail from './detail.vue';
    import Status from './status.vue';
    import Mqerror from './components/mqerror.vue';

    import moment from 'moment';

    export default {
        components : {
            Site,
            Detail,
            Status,
            Mqerror
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
            this.$store.dispatch('loadQueuemanagers');
        },
        methods : {
            addQueuemanager() {
                this.$store.dispatch('addQueuemanager', { queuemanager : this.selectedQueuemanager });
                this.selectedQueuemanager = "";
            },
            formatDate(date) {
                return moment(date).format('L LTS');
            },
            inErrorState(name) {
                return this.$store.getters.inErrorState(name);
            }
        }
    }
</script>
