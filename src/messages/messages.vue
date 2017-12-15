<template>
    <div>
        <section v-if="queue" class="uk-section uk-section-small uk-container uk-container-expand">
            <h1 class="uk-heading-primary uk-heading-divider">
                Messages - {{ queuemanagerName }} - {{ queueName }}
            </h1>
            <div v-if="!browsed && warnAboutQDepth" class="uk-alert-warning" uk-alert>
              {{ queueName }} contains <strong>{{ queueDepth }}</strong> messages. Please confirm that you
              want to browse all these messages.
            </div>
            <form v-if="warnAboutQDepth" class="uk-grid-small" uk-grid>
                <div class="uk-width-3-4@s">
                    <input v-model="limit" class="uk-input" type="text" placeholder="Number of messages to browse" />
                </div>
                <div class="uk-width-1-4@s">
                    <button @click.stop="browseMessages" class="uk-button uk-button-default" type="button">Browse</button>
                </div>
            </form>
            <div v-if="error" class="uk-alert-danger" uk-alert>
              <strong>{{ error.reason.code }}</strong> - <strong>{{ error.reason.desc }}</strong> occurred on {{ error.object }}
            </div>
            <div v-if="!error && browsed && messageCount == 0" class="uk-alert-warning" uk-alert>
              After browsing the queue {{ queueName }}, it seems that are no messages anymore on this queue.
              This can occur when all of these messages are expired or if another active application has
              processed these messages.
            </div>
            <div v-if="browsed && messageCount > 0">
                {{ messageCount }} / {{ queueDepth }}
                <table class="uk-table uk-table-divider uk-table-striped uk-table-small">
                    <thead>
                        <tr>
                            <th class="uk-width-small">
                              Put Datetime
                            </th>
                            <th class="uk-width-small">
                              Message ID<br />Correlation ID
                            </th>
                            <th class="uk-width-small">
                              Format<br />
                              Type
                            </th>
                            <th class="uk-width-small">
                              Code CharSet ID<br />Encoding
                            </th>
                            <th class="uk-width-small">
                              Length
                            </th>
                            <th class="uk-width-small">
                              Put Appl. Name<br />
                              Put Appl. Type
                            </th>
                            <th class="uk-width-small">
                              User Identifier
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="message in messages">
                            <td>
                              {{ message.PutDatetime }}
                            </td>
                            <td>
                              {{ message.MsgId }}<br />
                              {{ message.CorrelId }}
                            </td>
                            <td>
                              {{ message.Format }}<br />
                              {{ message.MsgType }}
                            </td>
                            <td>
                              {{ message.CodedCharSetId }}<br />
                              {{ message.Encoding }}
                            </td>
                            <td>
                              {{ message.Length }}
                            </td>
                            <td>
                              {{ message.PutApplName }}<br />
                              {{ message.PutApplType }}
                            </td>
                            <td>
                              {{ message.User }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                {{ messageCount }} / {{ queueDepth }}
            </div>
        </section>
    </div>
</template>

<script>
  export default {
    props : [
        'queuemanagerName',
        'queueName'
    ],
    data() {
        return {
            browsed : false,
            limit : 100
        };
    },
    computed : {
        queue() {
            var queue = this.$store.getters['queueModule/getQueue'](this.queueName);
            if (queue) return queue.detail;
            return null;
        },
        queueDepth() {
            if (this.queue && this.queue.CurrentQDepth) {
                return this.queue.CurrentQDepth.value;
            }
            return 0;
        },
        warnAboutQDepth() {
          return this.queueDepth > 100;
        },
        messages() {
          return this.$store.getters['messageModule/messages'];
        },
        messageCount() {
          return Object.keys(this.messages).length;
        },
        error() {
          return this.$store.getters['messageModule/error'];
        }
    },
    created() {
        this.$store.dispatch('queueModule/inquireQueue', {
            queuemanager : this.queuemanagerName,
            queue : this.queueName
        });
    },
    watch : {
        queue(nv) {
            if ( nv ) {
                if (this.queueDepth < 100) {
                  this.browseMessages();
                }
            }
        }
    },
    methods : {
        browseMessages() {
            this.$store.dispatch('messageModule/browseMessages', {
              queuemanager : this.queuemanagerName,
              queue : this.queueName
            }).then(() => {
              this.browsed = true;
            });
        }
    }
  }
</script>
