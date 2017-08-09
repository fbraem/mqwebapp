<template>
    <div class="uk-grid">
        <div class="uk-width-expand">
            <router-link :to="queuemanager.name" class="uk-link-text">Details</router-link><br />
            <span v-if="!queuemanager.detail" class="uk-text-meta">When is the queuemanager altered?</span>
            <span v-else class="uk-text-meta">
                Created on <span class="uk-text-bold">{{ creationDatetime }}</span> - Altered on <span class="uk-text-bold">{{ alterationDatetime }}</span>
            </span>
        </div>
        <div>
            <a class="uk-icon-link" uk-icon="icon: more" @click="inquireQueuemanager(queuemanager.name)"></a>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        props : {
            queuemanager : {
                required : true
            }
        },
        data() {
            return {};
        },
        computed : {
            creationDatetime() {
                var datetime = moment(this.queuemanager.detail.CreationDate.value + ' ' + this.queuemanager.detail.CreationTime.value, 'YYYYMMDD HHmmss');
                return datetime.format('L LTS');
            },
            alterationDatetime(queuemanager) {
                var datetime = moment(this.queuemanager.detail.AlterationDate.value + ' ' + this.queuemanager.detail.AlterationTime.value, 'YYYYMMDD HHmmss');
                return datetime.format('L LTS');
            }
        },
        methods : {
            inquireQueuemanager(queuemanager) {
                this.$store.dispatch('queuemanagerModule/inquireQueuemanager', { queuemanager : queuemanager });
            }
        }
    };
</script>
