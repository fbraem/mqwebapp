<template>
    <div class="uk-grid">
        <div class="uk-width-expand">
            Status<br />
            <span v-if="!queuemanager.status" class="uk-text-meta">What's the status of this queuemanager?</span>
            <span v-else class="uk-text-meta">
                <span :class="{ 'uk-text-success' : isRunning }">
                    <span v-if="isRunning" uk-icon="icon: check"></span>&nbsp;{{ queuemanager.status.QMgrStatus.text }} since {{ startDate }}
                </span>
            </span>
        </div>
        <div>
            <a class="uk-float-right" uk-icon="icon: more" @click="inquireQueuemanagerStatus(queuemanager.name)"></a>
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
            isRunning() {
                return this.queuemanager.status.QMgrStatus.text == 'Running';
            },
            startDate() {
                var datetime = moment(this.queuemanager.status.StartDate.value + ' ' + this.queuemanager.status.StartTime.value, 'YYYYMMDD HHmmss');
                return datetime.format('L LTS');
            }
        },
        methods : {
            inquireQueuemanagerStatus(queuemanager) {
                this.$store.dispatch('queuemanagerModule/inquireQueuemanagerStatus', { queuemanager : queuemanager});
            }
        }
    };
</script>
