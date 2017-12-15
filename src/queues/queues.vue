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
            <table class="uk-table uk-table-divider uk-table-striped uk-table-small">
                <thead>
                    <tr>
                        <th class="uk-width-small">
                          Queue <i @click="switchNameOrder()" v-if="orderBy == 'name'":uk-icon="nameOrder == 0 ? 'icon: chevron-up' : 'icon: chevron-down'" class="uk-float-right"></i>
                          <i v-else @click="setOrder('name')" uk-icon="icon: chevron-right" class="uk-float-right"></i>
                        </th>
                        <th class="uk-width-small">Type</th>
                        <th class="uk-width-small">
                          Current
                          <i @click="switchQDepthOrder()" v-if="orderBy == 'qdepth'":uk-icon="qdepthOrder == 0 ? 'icon: chevron-up' : 'icon: chevron-down'" class="uk-float-right"></i>
                          <i v-else @click="setOrder('qdepth')" uk-icon="icon: chevron-right" class="uk-float-right"></i>
                          <br />QDepth
                        </th>
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
                                <span v-if="queue.detail.CurrentQDepth">
                                  <router-link v-if="queue.detail.CurrentQDepth.value > 0" :to="'/' + queuemanagerName + '/messages/' + queue.detail.QName.value">
                                    {{ queue.detail.CurrentQDepth.value }}
                                  </router-link>
                                  <span v-else>
                                    {{ queue.detail.CurrentQDepth.value }}
                                  </span>
                                </span>
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
                filter : '*',
                orderBy : 'name',
                nameOrder : 0, // 0 = ASC, 1 = DESC
                qdepthOrder : 1 // 0 = ASC, 1 = DESC
            };
        },
        computed : {
            queues() {
                var queues = this.$store.state.queueModule.queues;
                if (this.orderBy == 'name') {
                    const ordered = [];
                    Object.keys(queues).sort((a, b) => {
                      if (a < b) return this.nameOrder == 0 ? -1 : 1;
                      if (a > b) return this.nameOrder == 0 ? 1 : -1;
                      return 0;
                    }).forEach((key) => {
                        ordered.push(queues[key]);
                    });
                    return ordered;
                }
                // Sort by qdepth
                const ordered = [];
                Object.keys(queues).sort((a, b) => {
                    var q1 = queues[a];
                    var q2 = queues[b];

                    var num1 = q1.detail && q1.detail.CurrentQDepth ? q1.detail.CurrentQDepth.value : -1;
                    var num2 = q2.detail && q2.detail.CurrentQDepth ? q2.detail.CurrentQDepth.value : -1;

                    if (num1 < num2) return this.qdepthOrder == 0 ? -1 : 1;
                    if (num1 > num2) return this.qdepthOrder == 0 ? 1 : -1;

                    if (a < b) return this.nameOrder == 0 ? -1 : 1;
                    if (a > b) return this.nameOrder == 0 ? 1 : -1;
                    return 0;
                }).forEach((key) => {
                    ordered.push(queues[key]);
                });
                return ordered;
            }
        },
        methods : {
            setOrder(newOrder) {
                this.orderBy = newOrder;
            },
            switchNameOrder() {
                this.nameOrder = !this.nameOrder;
            },
            switchQDepthOrder() {
                this.qdepthOrder = !this.qdepthOrder;
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
