<template>
    <section class="uk-section uk-section-small uk-container uk-container-expand">
        <h1 class="uk-heading-primary uk-heading-divider">
            Queues - {{ queuemanagerName }}
        </h1>
        <form class="uk-grid-small" uk-grid>
            <div class="uk-width-3-4@s">
                <input v-model="filter" class="uk-input" type="text" placeholder="Queue Filter" />
            </div>
            <div class="uk-width-1-4@s">
                <button @click.stop="inquireQueues" class="uk-button uk-button-default" type="button">Filter</button>
            </div>
        </form>
        <div v-if="queues && queues.length > 0">
            <button class="uk-button uk-button-default" type="button">Order</button>
            <div ref="dropdownOrder" uk-dropdown="delay-hide:0">
                <ul class="uk-nav uk-dropdown-nav">
                    <li><a @click="setOrder('name')">Order by name</a></li>
                    <li><a @click="setOrder('qdepth')">Order by queuedepth</a></li>
                </ul>
            </div>
            <table class="uk-table uk-table-divider uk-table-striped uk-table-small">
                <thead>
                    <tr>
                        <th class="uk-width-small">Queue</th>
                        <th class="uk-width-small">Type</th>
                        <th class="uk-width-small">Current<br />QDepth</th>
                        <th class="uk-width-small">Input<br /> Count</th>
                        <th class="uk-width-small">Input<br />Enabled</th>
                        <th class="uk-width-small">Output<br />Count</th>
                        <th class="uk-width-small">Output<br /> Enabled</th>
                        <th>Creation Date<br />Alteration Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="queue in queues">
                        <td>
                            <router-link :to="'/' + queuemanagerName + '/queues/' + queue.detail.QName.value">
                                {{ queue.detail.QName.value }}
                            </router-link>
                            <div v-if="queue.detail.QDesc.value.length > 0" class="uk-text-meta">
                                {{ queue.detail.QDesc.value }}
                            </div>
                        </td>
                        <td>{{ queue.detail.QType.text }}</td>
                        <td>
                            <div class="uk-align-right">
                                <span v-if="queue.detail.CurrentQDepth">{{ queue.detail.CurrentQDepth.value }}</span>
                                <span v-else>-</span>
                            </div>
                        </td>
                        <td>
                            <div class="uk-align-right">
                                <span v-if="queue.detail.OpenInputCount">{{ queue.detail.OpenInputCount.value }}</span>
                                <span v-else>-</span>
                            </div>
                        </td>
                        <td>
                            <span v-if="queue.detail.InhibitGet">
                                <i v-if="queue.detail.InhibitGet.text == 'Allowed'" style="color: green" uk-icon="icon: check"></i>
                                <i v-else style="color: red" uk-icon="icon: close"></i>
                            </span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <div class="uk-align-right">
                                <span v-if="queue.detail.OpenOutputCount">{{ queue.detail.OpenOutputCount.value }}</span>
                                <span v-else>-</span>
                            </div>
                        </td>
                        <td>
                            <span v-if="queue.detail.InhibitPut">
                                <i v-if="queue.detail.InhibitPut.text == 'Allowed'" style="color: green" uk-icon="icon: check"></i>
                                <i v-else style="color: red" uk-icon="icon: close"></i>
                            </span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <div v-if="queue.detail.CreationDate">
                                {{ formatDate(queue.detail.CreationDate.value + ' ' + queue.detail.CreationTime.value) }}
                            </div>
                            <div v-else>
                                -
                            </div>
                            <div v-if="queue.detail.AlterationDate">
                                {{ formatDate(queue.detail.AlterationDate.value + ' ' + queue.detail.AlterationTime.value) }}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else="" class="uk-alert-primary" uk-alert>
            A filter is a character string followed by an asterisk (*), for example KBC*, and it selects all
            queues having names that start with the selected character string. An asterisk on its own matches
            all possible names.
        </div>
    </section>
</template>

<script>
    import UIkit from 'uikit';
    import moment from 'moment';

    export default {
        props : [
            'queuemanagerName'
        ],
        data() {
            return {
                'filter' : '*',
                'orderBy' : 'name'
            };
        },
        computed : {
            queues() {
                var queues = this.$store.state.queueModule.queues;
                if (this.orderBy == 'name') {
                    const ordered = [];
                    Object.keys(queues).sort().forEach((key) => {
                        ordered.push(queues[key]);
                    });
                    return ordered;
                }
                // Sort by qdepth
                const ordered = [];
                Object.keys(queues).sort((a, b) => {
                    var q1 = queues[a];
                    var q2 = queues[b];
                    if (q1.detail && q1.detail.CurrentQDepth) {
                        if (q2.detail && q2.detail.CurrentQDepth) {
                            if (q1.detail.CurrentQDepth.value < q2.detail.CurrentQDepth.value) return 1;
                            if (q1.detail.CurrentQDepth.value > q2.detail.CurrentQDepth.value) return -1;
                        }
                        return -1;
                    }
                    return 1;
                }).forEach((key) => {
                    ordered.push(queues[key]);
                });
                return ordered;
            }
        },
        created() {
            this.$store.dispatch('queueModule/init');
            this.$store.dispatch('queuemanagerModule/inquireQueuemanager', { queuemanager : this.queuemanagerName });
        },
        methods : {
            setOrder(newOrder) {
                UIkit.dropdown(this.$refs.dropdownOrder).hide();
                this.orderBy = newOrder;
            },
            formatDate(date) {
                var datetime = moment(date, 'YYYYMMDD HHmmss');
                return datetime.format('L LTS');
            },
            inquireQueues()
            {
              this.$store.dispatch('queueModule/inquireQueues', {
                queuemanager : this.queuemanagerName,
                filter : this.filter
              });
            }
        }
    }
</script>
