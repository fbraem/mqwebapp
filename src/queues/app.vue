<template>
    <site>
        <div slot="content">
            <section class="uk-section uk-section-small uk-container uk-container-expand">
                <h1 class="uk-heading-primary uk-heading-divider">
                    Queues - {{ name }}
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
                                {{ queue.QName.value }}
                                <div v-if="queue.QDesc.value.length > 0" class="uk-text-meta">
                                    {{ queue.QDesc.value }}
                                </div>
                            </td>
                            <td>{{ queue.QType.text }}</td>
                            <td>
                                <span v-if="queue.CurrentQDepth">{{ queue.CurrentQDepth.value }}</span>
                                <span v-else>-</span>
                            </td>
                            <td>
                                <span v-if="queue.OpenInputCount">{{ queue.OpenInputCount.value }}</span>
                                <span v-else>-</span>
                            </td>
                            <td>
                                <span v-if="queue.InhibitGet">
                                    <i v-if="queue.InhibitGet.text == 'Allowed'" style="color: green" uk-icon="icon: check"></i>
                                    <i v-else style="color: red" uk-icon="icon: close"></i>
                                </span>
                                <span v-else>-</span>
                            </td>
                            <td>
                                <span v-if="queue.OpenOutputCount">{{ queue.OpenOutputCount.value }}</span>
                                <span v-else>-</span>
                            </td>
                            <td>
                                <span v-if="queue.InhibitPut">
                                    <i v-if="queue.InhibitPut.text == 'Allowed'" style="color: green" uk-icon="icon: check"></i>
                                    <i v-else style="color: red" uk-icon="icon: close"></i>
                                </span>
                                <span v-else>-</span>
                            </td>
                            <td>
                                <span v-if="queue.CreationDate">
                                    {{ formatDate(queue.CreationDate.value + ' ' + queue.CreationTime.value) }}
                                </span>
                                <br />
                                <span v-if="queue.AlterationDate">
                                    {{ formatDate(queue.AlterationDate.value + ' ' + queue.AlterationTime.value) }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    </site>
</template>

<script>
    import Site from '@/site/components/site.vue';

    import UIkit from 'uikit';
    import moment from 'moment';

    export default {
        components : {
            Site
        },
        props : [
            'name'
        ],
        data() {
            return {
                'orderBy' : 'name'
            };
        },
        computed : {
            queues() {
                var queues = this.$store.state.queues;
                return queues.sort((a, b) => {
                    if (this.orderBy == 'name') {
                        if (a.QName.value < b.QName.value) return -1;
                        if (a.QName.value > b.QName.value) return 1;
                        return 0;
                    } else {
                        if (a.CurrentQDepth) {
                            if (b.CurrentQDepth) {
                                if (a.CurrentQDepth.value < b.CurrentQDepth.value) return 1;
                                if (a.CurrentQDepth.value > b.CurrentQDepth.value) return -1;
                            }
                            return -1;
                        }
                        return 1;
                    }
                });
            }
        },
        mounted() {
            this.$store.dispatch('inquireQueues', { queuemanager : this.name });
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
