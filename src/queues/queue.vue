<template>
    <section class="uk-section uk-section-small uk-container uk-container-expand">
        <h1 class="uk-heading-divider">
            Queue - {{ queueName }} - {{ queuemanagerName }}
        </h1>
        <div class="uk-flex-center" uk-grid>
            <div v-if="used != -1" class="">
                <div class="uk-card uk-card-default uk-card-small">
                    <div class="uk-card-body">
                        <div class="uk-flex uk-flex-middle">
                            <div :class="capacityClass">
                                <i uk-icon="icon: database; ratio: 2"></i>
                            </div>
                            <div class="uk-margin-left">
                                Capacity<br />
                                <span class="uk-text-large">{{ used }} % free</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="queue && queue.CurrentQDepth">
                <div class="uk-card uk-card-default uk-card-small">
                    <div class="uk-card-body">
                        <div class="uk-flex uk-flex-middle">
                            <div>
                                <i uk-icon="icon: hashtag; ratio: 2"></i>
                            </div>
                            <div class="uk-margin-left">
                                Messages<br />
                                <span class="uk-text-large">{{ queue.CurrentQDepth.value }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="inputCount != -1">
                <div class="uk-card uk-card-default uk-card-small">
                    <div class="uk-card-body">
                        <div class="uk-flex uk-flex-middle">
                            <div>
                                <i uk-icon="icon: push; ratio: 2"></i>
                            </div>
                            <div class="uk-margin-left">
                                Input Count<br />
                                <span class="uk-text-large">{{ inputCount }} processes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="outputCount != -1">
                <div class="uk-card uk-card-default uk-card-small">
                    <div class="uk-card-body">
                        <div class="uk-flex uk-flex-middle">
                            <div>
                                <i uk-icon="icon: pull; ratio: 2"></i>
                            </div>
                            <div class="uk-margin-left ">
                                Output Count<br />
                                <span class="uk-text-large">{{ outputCount }} processes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="queue" class="uk-child-width-1-2@s uk-child-width-2-3@m" uk-grid>
            <div>
                <div class="uk-card uk-card-default uk-card-small">
                    <div class="uk-card-header">
                        <h3 class="uk-card-title">General Information</h3>
                        <div v-if="queue.creationDate" class="uk-text-meta">This queue was created on {{ creationDatetime }} and last modified on {{ alterationDatetime }}</div>
                        <div v-else class="uk-text-meta">This queue was last modified on {{ alterationDatetime }}</div>
                    </div>
                    <div class="uk-card-body">
                        <table class="uk-table uk-table-divider uk-table-small uk-table-responsive">
                            <tbody>
                                <tr>
                                    <th>Queue Type</th>
                                    <td>{{ queue.QType.text }}</td>
                                </tr>
                                <tr v-if="queue.InhibitGet">
                                    <th>Get</th>
                                    <td>
                                        <i v-if="queue.InhibitGet.value == 1" uk-icon="icon: warning" class="uk-float-right uk-text-danger"></i>
                                        <i v-else uk-icon="icon: check" class="uk-float-right uk-text-success"></i>
                                        {{ queue.InhibitGet.text }}
                                    </td>
                                </tr>
                                <tr v-if="queue.InhibitPut">
                                    <th>Put</th>
                                    <td>
                                        <i v-if="queue.InhibitPut.value == 1" uk-icon="icon: warning" class="uk-float-right uk-text-danger"></i>
                                        <i v-else uk-icon="icon: check" class="uk-float-right uk-text-success"></i>
                                        {{ queue.InhibitPut.text }}
                                    </td>
                                </tr>
                                <tr v-if="queue.Usage">
                                    <th>Usage</th>
                                    <td>
                                        {{ queue.Usage.text }}
                                    </td>
                                </tr>
                                <tr v-if="queue.BackoutRequeueName">
                                    <th>Backout Requeue Name</th>
                                    <td>
                                      <span v-if="queue.BackoutRequeueName.value.length > 0">{{ queue.BackoutRequeueName.value }}</span>
                                      <span v-else="">-</span>
                                    </td>
                                </tr>
                                <tr v-if="queue.BackoutThreshold">
                                    <th>Backout Threshold</th>
                                    <td>
                                      {{ queue.BackoutThreshold.value }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div>
                <div class="uk-card uk-card-default uk-card-small">
                    <div class="uk-card-header">
                        <h3 class="uk-card-title">Statistical Information</h3>
                    </div>
                    <div class="uk-card-body">
                        <table class="uk-table uk-table-divider uk-table-small uk-table-responsive">
                            <tbody>
                                <tr>
                                    <th>Current / Maximum Queuedepth</th>
                                    <td v-if="queue.CurrentQDepth">
                                      <router-link :to="'/' + queuemanagerName + '/messages/' + queueName">
                                          {{ queue.CurrentQDepth.value }}
                                      </router-link>
                                      / {{ queue.MaxQDepth.value }}
                                    </td>
                                </tr>
                                <tr v-if="inputCount != -1">
                                  <th>Open Input Count</th>
                                  <td>{{ inputCount }}</td>
                                </tr>
                                <tr v-if="outputCount != -1">
                                  <th>Open Output Count</th>
                                  <td>{{ outputCount }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div v-if="isAlias">
                <div class="uk-card uk-card-default uk-card-small">
                    <div class="uk-card-header">
                        <h3 class="uk-card-title">Alias Queue</h3>
                    </div>
                    <div class="uk-card-body">
                        <table class="uk-table uk-table-divider uk-table-small uk-table-responsive">
                            <tbody>
                                <tr>
                                    <th>Target Queue</th>
                                    <td>
                                        <router-link :to="'/' + queuemanagerName + '/queues/' + queue.BaseObjectName.value">
                                            {{ queue.BaseObjectName.value }}
                                        </router-link>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Target Queue Type</th>
                                    <td>{{ queue.BaseType.text }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import moment from 'moment';

    export default {
        props : [
            'queueName',
            'queuemanagerName'
        ],
        data() {
            return {
            };
        },
        computed : {
            queue() {
                var queue = this.$store.getters['queueModule/getQueue'](this.queueName);
                if (queue) return queue.detail;
                return null;
            },
            used() {
                if (this.queue && this.queue.CurrentQDepth && this.queue.MaxQDepth) {
                    return Math.round(100 - this.queue.CurrentQDepth.value / this.queue.MaxQDepth.value * 100).toFixed(2);
                }
                return -1;
            },
            inputCount() {
                if (this.queue && this.queue.OpenInputCount) {
                    return this.queue.OpenInputCount.value;
                }
                return -1;
            },
            outputCount() {
                if (this.queue && this.queue.OpenOutputCount) {
                    return this.queue.OpenOutputCount.value;
                }
                return -1;
            },
            capacityClass() {
                var used = this.used;
                if ( used != -1 ) {
                    if ( used < 20 ) {
                        return { 'uk-text-danger' : true };
                    } else if ( used < 50 ) {
                        return { 'uk-text-warning' : true };
                    } else {
                        return { 'uk-text-success' : true };
                    }
                }
                return {};
            },
            isAlias() {
                return this.$store.getters['queueModule/isAlias'](this.queueName);
            },
            creationDatetime() {
                if (this.queue && this.queue.CreationDate) {
                    var datetime = moment(this.queue.CreationDate.value + ' ' + this.queue.CreationTime.value, 'YYYYMMDD HHmmss');
                    return datetime.format('L LTS');
                }
                return '';
            },
            alterationDatetime() {
                if (this.queue) {
                    var datetime = moment(this.queue.AlterationDate.value + ' ' + this.queue.AlterationTime.value, 'YYYYMMDD HHmmss');
                    return datetime.format('L LTS');
                }
                return '';
            }
        },
        mounted() {
            this.$store.dispatch('queueModule/inquireQueue', {
                queuemanager : this.queuemanagerName,
                queue : this.queueName
            });
        },
        watch : {
            '$route'(to, from) {
                this.$store.dispatch('queueModule/inquireQueue', {
                    queuemanager : this.queuemanagerName,
                    queue : this.queueName
                });
            }
        },
        methods: {
        }
    };
</script>
