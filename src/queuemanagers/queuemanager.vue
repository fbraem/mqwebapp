<template>
    <div>
        <section class="uk-section uk-section-small uk-container uk-container-expand">
            <h1 class="uk-heading-primary uk-heading-divider">
                <a href="" uk-icon="icon: menu; ratio: 2" uk-toggle="target: #offcanvas-menu"></a>
                <span v-if="queuemanager" class="uk-label uk-float-right">{{ queuemanager.Platform.text }}</span>
                {{ queuemanagerName }}
            </h1>
            <mqerror v-if="error" :error="error"></mqerror>
            <p v-if="queuemanager" class="uk-text-meta">{{ queuemanager.QMgrDesc.value }}</p>
            <hr class="uk-divider" />
            <div v-if="queuemanager" class="uk-child-width-1-2@s uk-child-width-2-3@m" uk-grid>
                <div>
                    <div class="uk-card uk-card-default uk-card-small">
                        <div class="uk-card-header">
                            <h3 class="uk-card-title">General Information</h3>
                            <div class="uk-text-meta">This queuemanager was created on {{ creationDatetime }} and last modified on {{ alterationDatetime }}</div>
                        </div>
                        <div class="uk-card-body">
                            <table class="uk-table uk-table-divider uk-table-small uk-table-responsive">
                                <tbody>
                                    <tr>
                                        <th>Queuemanager Identifier</th>
                                        <td>{{ queuemanager.QMgrIdentifier.value }}</td>
                                    </tr>
                                    <tr>
                                        <th>Coded Character Set Identifier (CCSID)</th>
                                        <td>{{ queuemanager.CodedCharSetID.value }}</td>
                                    </tr>
                                    <tr>
                                        <th>Dead Letter Queue</th>
                                        <td v-if="queuemanager.DeadLetterQName.value.length > 0">{{ queuemanager.DeadLetterQName.value }}</td>
                                        <td v-if="queuemanager.DeadLetterQName.value.length == 0" class="uk-alert-warning"><i uk-icon="icon: warning"></i> No dead letter queue set. It is recommended to have one ...</td>
                                    </tr>
                                    <tr>
                                        <th>Platform</th>
                                        <td>{{ queuemanager.Platform.text }}</td>
                                    </tr>
                                    <tr>
                                        <th>Syncpoint</th>
                                        <td>{{ queuemanager.SyncPoint.text }}</td>
                                    </tr>
                                    <tr>
                                        <th>Default Transmission Queue</th>
                                        <td>{{ queuemanager.DefXmitQName.value }}</td>
                                    </tr>
                                    <tr>
                                        <th>Maximum Message Length</th>
                                        <td>{{ queuemanager.MaxMsgLength.value }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="uk-card uk-card-default uk-card-small">
                        <div class="uk-card-header">
                            <h3 class="uk-card-title">Commandserver Information</h3>
                        </div>
                        <div class="uk-card-body">
                            <table class="uk-table uk-table-divider uk-table-small uk-table-responsive">
                                <tbody>
                                    <tr>
                                        <th>Command Level</th>
                                        <td>{{ queuemanager.CommandLevel.text }}</td>
                                    </tr>
                                    <tr>
                                        <th>Command Input Queue</th>
                                        <td>{{ queuemanager.CommandInputQName.value }}</td>
                                    </tr>
                                    <tr>
                                        <th>Command Event</th>
                                        <td>{{ queuemanager.CommandEvent.text }}</td>
                                    </tr>
                                    <tr>
                                        <th>Command Server Control</th>
                                        <td>{{ queuemanager.CommandServerControl.text }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="uk-card uk-card-default uk-card-small">
                        <div class="uk-card-header">
                            <h3 class="uk-card-title">Channel Information</h3>
                        </div>
                        <div class="uk-card-body">
                            <table class="uk-table uk-table-divider uk-table-small uk-table-responsive">
                                <tbody>
                                    <tr>
                                        <th>Channel Auto Definition</th>
                                        <td>{{ queuemanager.ChannelAutoDef.text }}</td>
                                    </tr>
                                    <tr>
                                        <th>Channel Auto Definition Event</th>
                                        <td>{{ queuemanager.ChannelAutoDefEvent.text }}</td>
                                    </tr>
                                    <tr>
                                        <th>Channel Auto Definition Exit</th>
                                        <td>{{ queuemanager.ChannelAutoDefExit.value }}</td>
                                    </tr>
                                    <tr>
                                        <th>Channel Authentication Records</th>
                                        <td>{{ queuemanager.ChannelAuthenticationRecords.text }}</td>
                                    </tr>
                                    <tr>
                                        <th>Channel Event</th>
                                        <td>{{ queuemanager.ChannelEvent.text }}</td>
                                    </tr>
                                    <tr>
                                        <th>Channel Initiator Control</th>
                                        <td>{{ queuemanager.ChannelInitiatorControl.text }}</td>
                                    </tr>
                                    <tr>
                                        <th>Channel Monitoring</th>
                                        <td>{{ queuemanager.ChannelMonitoring.text }}</td>
                                    </tr>
                                    <tr>
                                        <th>Channel Statistics</th>
                                        <td>{{ queuemanager.ChannelStatistics.text }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="uk-card uk-card-default uk-card-small">
                        <div class="uk-card-header">
                            <h3 class="uk-card-title">Cluster Information</h3>
                        </div>
                        <div class="uk-card-body">
                            <table class="uk-table uk-table-divider uk-table-small uk-table-responsive">
                                <tbody>
                                    <tr>
                                        <th>Cluster Sender Monitoring</th>
                                        <td>{{ queuemanager.ClusterSenderMonitoringDefault.text }}</td>
                                    </tr>
                                    <tr>
                                        <th>Cluster Sender Statistics</th>
                                        <td>{{ queuemanager.ClusterSenderStatistics.text }}</td>
                                    </tr>
                                    <tr>
                                        <th>Cluster Workload Data</th>
                                        <td>{{ queuemanager.ClusterWorkLoadData.value }}</td>
                                    </tr>
                                    <tr>
                                        <th>Cluster Workload Exit</th>
                                        <td>{{ queuemanager.ClusterWorkLoadExit.value }}</td>
                                    </tr>
                                    <tr>
                                        <th>Cluster Workload Length</th>
                                        <td>{{ queuemanager.ClusterWorkLoadLength.value }}</td>
                                    </tr>
                                    <tr>
                                        <th>Cluster Workload MRU Channels</th>
                                        <td>{{ queuemanager.CLWLMRUChannels.value }}</td>
                                    </tr>
                                    <tr>
                                        <th>Cluster Workload Use Queue</th>
                                        <td>{{ queuemanager.CLWLUseQ.text }}</td>
                                    </tr>
                                    <tr>
                                        <th>Default Cluster XmitQ Type</th>
                                        <td>{{ queuemanager.DefClusterXmitQueueType.text }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <div id="offcanvas-menu" uk-offcanvas="overlay:true">
            <div class="uk-offcanvas-bar">
                <button class="uk-offcanvas-close" type="button" uk-close></button>
                <h3>{{ queuemanagerName }}</h3>
                <ul class="uk-nav uk-nav-default">
                    <li><a :href="'status.html#/' + queuemanagerName">Status</a></li>
                    <li><a :href="'clusters.html#/' + queuemanagerName">Clusters</a></li>
                    <li><a :href="'queues.html#/' + queuemanagerName">Queues</a></li>
                    <li><a :href="'channels.html#' + queuemanagerName">Channels</a></li>
                    <li><a :href="'listeners.html#' + queuemanagerName">Listeners</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import Mqerror from '@/site/components/mqerror.vue';

    import moment from 'moment';

    export default {
        components : {
            Mqerror
        },
        props : [
            'queuemanagerName'
        ],
        data() {
            return {
            };
        },
        computed : {
            queuemanager() {
                var queuemanager = this.$store.getters['queuemanagerModule/getQueuemanager'](this.queuemanagerName);
                if (queuemanager) return queuemanager.detail;
                return null;
            },
            error() {
                return this.$store.state.error;
            },
            creationDatetime() {
                var datetime = moment(this.queuemanager.CreationDate.value + ' ' + this.queuemanager.CreationTime.value, 'YYYYMMDD HHmmss');
                return datetime.format('L LTS');
            },
            alterationDatetime() {
                var datetime = moment(this.queuemanager.AlterationDate.value + ' ' + this.queuemanager.AlterationTime.value, 'YYYYMMDD HHmmss');
                return datetime.format('L LTS');
            }

        },
        mounted() {
            this.$store.dispatch('queuemanagerModule/inquireQueuemanager', { queuemanager : this.queuemanagerName });
        },
        methods : {
        }
    }
</script>
