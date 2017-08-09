<template>
    <section class="uk-section uk-section-small uk-container uk-container-expand">
        <h1 class="uk-heading-primary uk-heading-divider">
            Queues - {{ queuemanagerName }}
        </h1>
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
                        <span v-if="queue.detail.CurrentQDepth">{{ queue.detail.CurrentQDepth.value }}</span>
                        <span v-else>-</span>
                    </td>
                    <td>
                        <span v-if="queue.detail.OpenInputCount">{{ queue.detail.OpenInputCount.value }}</span>
                        <span v-else>-</span>
                    </td>
                    <td>
                        <span v-if="queue.detail.InhibitGet">
                            <i v-if="queue.detail.InhibitGet.text == 'Allowed'" style="color: green" uk-icon="icon: check"></i>
                            <i v-else style="color: red" uk-icon="icon: close"></i>
                        </span>
                        <span v-else>-</span>
                    </td>
                    <td>
                        <span v-if="queue.detail.OpenOutputCount">{{ queue.detail.OpenOutputCount.value }}</span>
                        <span v-else>-</span>
                    </td>
                    <td>
                        <span v-if="queue.detail.InhibitPut">
                            <i v-if="queue.detail.InhibitPut.text == 'Allowed'" style="color: green" uk-icon="icon: check"></i>
                            <i v-else style="color: red" uk-icon="icon: close"></i>
                        </span>
                        <span v-else>-</span>
                    </td>
                    <td>
                        <span v-if="queue.detail.CreationDate">
                            {{ formatDate(queue.detail.CreationDate.value + ' ' + queue.detail.CreationTime.value) }}
                        </span>
                        <br />
                        <span v-if="queue.detail.AlterationDate">
                            {{ formatDate(queue.detail.AlterationDate.value + ' ' + queue.detail.AlterationTime.value) }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
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
                'orderBy' : 'name'
            };
        },
        computed : {
            queues() {
                var queues = this.$store.state.queueModule.queues;
                return queues.sort((a, b) => {
                    if (this.orderBy == 'name') {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;
                        return 0;
                    } else {
                        if (a.detail && a.detail.CurrentQDepth) {
                            if (b.detail && b.detail.CurrentQDepth) {
                                if (a.detail.CurrentQDepth.value < b.detail.CurrentQDepth.value) return 1;
                                if (a.detail.CurrentQDepth.value > b.detail.CurrentQDepth.value) return -1;
                            }
                            return -1;
                        }
                        return 1;
                    }
                });
            }
        },
        mounted() {
            this.$store.dispatch('queuemanagerModule/inquireQueuemanager', { queuemanager : this.queuemanagerName });
            this.$store.dispatch('queueModule/inquireQueues', { queuemanager : this.queuemanagerName });
        },
        methods : {
            setOrder(newOrder) {
                UIkit.dropdown(this.$refs.dropdownOrder).hide();
                this.orderBy = newOrder;
            },
            formatDate(date) {
                var datetime = moment(date, 'YYYYMMDD HHmmss');
                return datetime.format('L LTS');
            }
        }
    }
</script>
