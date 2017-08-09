<template>
    <div class="uk-offcanvas-content">
        <div uk-sticky="media: 960" class="uk-navbar-container uk-sticky uk-light"
            style="background-image:linear-gradient(to left, #28a5f5, #1e87f0)">
            <div style="float:right;margin:10px;">
                <a href="https://github.com/fbraem/mqwebapp"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png" alt="Fork me on GitHub"></a>
            </div>
            <div class="uk-container uk-container-expand ">
                <nav class="uk-navbar">
                    <div class="uk-navbar-left">
                        <a href="#" class="uk-navbar-item uk-logo">
                            MQWeb Demo Application
                        </a>
                    </div>
                </nav>
            </div>
        </div>
        <div class="uk-sticky-placeholder" style="height: 80px; margin: 0px;" hidden="hidden"></div>
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
        <router-view></router-view>
        <section v-if="logs.length > 0" class="uk-section uk-section-small uk-container uk-container-expand uk-section-muted">
            <ul uk-accordion>
                <li class="uk-open">
                    <h3 class="uk-accordion-title">Last 10 MQWeb requests</h3>
                    <div class="uk-accordion-content">
                        <table class="uk-table uk-table-small uk-table-justify uk-table-divider uk-text-small">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Queuemanager</th>
                                    <th>Start</th>
                                    <th>Taken</th>
                                    <th>Error</th>
                                    <th>Error Function</th>
                                    <th>Error Object</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in logs">
                                    <td>{{ item.count }}</td>
                                    <td>{{ item.meta.qmgr }}</td>
                                    <td>{{ formatDate(item.meta.date.start) }}</td>
                                    <td>{{ item.meta.elapsed }} s</td>
                                    <td>
                                        <div v-if="item.error" style="color: red" class="uk-text-bold uk-text-nowrap">
                                            <i uk-icon="icon: warning"></i>&nbsp;{{ item.error.reason.code }} - {{ item.error.reason.desc }}
                                        </div>
                                        <div v-else style="color: green">
                                            <i uk-icon="icon: check"></i>
                                        </div>
                                    </td>
                                    <td>
                                        <div v-if="item.error">
                                            {{ item.error.fn }}
                                        </div>
                                    </td>
                                    <td>
                                        <div v-if="item.error">
                                            {{ item.error.object }}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </li>
            </ul>
        </section>
        <section class="uk-section uk-container uk-container-expand uk-section-secondary">
            <span>&copy; <a href="http://www.mqweb.org">MQWeb</a></span>
        </section>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        data() {
            return {
                selectedQueuemanager : ""
            };
        },
        computed : {
            queuemanagers() {
                return this.$store.state.queuemanagerModule.queuemanagers;
            },
            selectableQueuemanagers() {
                return this.$store.getters.selectableQueuemanagers;
            },
            logs() {
                return this.$store.state.logs;
            }
        },
        mounted() {
            this.$store.dispatch('loadAvailable');
            if (this.queuemanagers.length == 0) {
                this.$store.dispatch('queuemanagerModule/loadQueuemanagers');
            }
        },
        methods : {
            addQueuemanager() {
                this.$store.dispatch('addQueuemanager', { queuemanager : this.selectedQueuemanager });
                this.selectedQueuemanager = "";
            },
            formatDate(date) {
                return moment(date).format('L LTS');
            }
        }
    }
</script>
