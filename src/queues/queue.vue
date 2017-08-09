<template>
    <section class="uk-section uk-section-small uk-container uk-container-expand">
        <h1 class="uk-heading-primary uk-heading-divider">
            Queue - {{ queueName }} - {{ queuemanagerName }}
        </h1>
    </section>
</template>

<script>
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
            }
        },
        mounted() {
            this.$store.dispatch('queueModule/inquireQueue', {
                queuemanager : this.queuemanagerName,
                queue : this.queueName
            });
        }
    };
</script>
