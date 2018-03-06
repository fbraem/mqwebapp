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
            <div v-if="count > 0">
                {{ count }} / {{ queueDepth }}
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
                              {{ message.mqmd.PutDatetime }}
                            </td>
                            <td>
                              {{ message.mqmd.MsgId }}<br />
                              {{ message.mqmd.CorrelId }}
                            </td>
                            <td>
															<span v-if="message.mqmd.Format == 'MQEVENT'">
																<a @click="showEventMessage(message.mqmd.MsgId)">{{ message.mqmd.Format }}</a>
															</span>
															<span v-else>
                              	{{ message.mqmd.Format }}
															</span>
															<br />
                              {{ message.mqmd.MsgType }}
                            </td>
                            <td>
                              {{ message.mqmd.CodedCharSetId }}<br />
                              {{ message.mqmd.Encoding }}
                            </td>
                            <td>
                              {{ message.mqmd.Length }}
                            </td>
                            <td>
                              {{ message.mqmd.PutApplName }}<br />
                              {{ message.mqmd.PutApplType }}
                            </td>
                            <td>
                              {{ message.mqmd.User }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                {{ count }} / {{ queueDepth }}
            </div>
        </section>
				<div ref="eventDialog" uk-modal>
					<div v-if="eventMessage" class="uk-modal-dialog uk-modal-body">
						<button class="uk-modal-close-default" type="button" uk-close></button>
						<div class="uk-modal-header">
							<h2 class="uk-modal-title">Event</h2>
						</div>
						<table class="uk-table uk-table-divider uk-table-small uk-table-responsive uk-table-middle">
								<tbody>
										<tr>
												<th style="vertical-align:middle;">Event Reason</th>
												<td>{{ eventMessage.event.Reason.desc }}</td>
										</tr>
										<tr>
												<th style="vertical-align:middle;">Event Queuemanager</th>
												<td>{{ eventMessage.event.EventQMgr.value }}</td>
										</tr>
										<tr>
												<th style="vertical-align:middle;">Event Origin</th>
												<td>{{ eventMessage.event.EventOrigin.text }}</td>
										</tr>
										<tr>
												<th style="vertical-align:middle;">Event User</th>
												<td>{{ eventMessage.event.EventUserId.value }}</td>
										</tr>
										<tr>
												<th style="vertical-align:middle;">Object Type</th>
												<td>{{ eventMessage.event.ObjectType.text }}</td>
										</tr>
										<template v-if="eventMessage.event.ObjectType.text == 'Authority Record'">
											<tr>
													<th style="vertical-align:middle;">Authorization List</th>
													<td>
														<div>
															<span v-for="(value, index) in eventMessage.event.AuthorizationList.value">
																{{ value.text }}<span v-if="index < eventMessage.event.AuthorizationList.value.length - 1">, </span>
															</span>
															<span v-if="eventMessage.event.MsgSeqNumber == 1" class="uk-label uk-align-right">
																original
															</span>
															<span class="uk-label uk-align-right" v-else>
																new
															</span>
														</div>
														<hr v-if="relatedMessage" uk-divider />
														<div v-if="relatedMessage">
															<span v-for="(value, index) in relatedMessage.event.AuthorizationList.value">
																{{ value.text }}<span v-if="index < relatedMessage.event.AuthorizationList.value.length - 1">, </span>
															</span>
															<span v-if="relatedMessage.event.MsgSeqNumber == 1" class="uk-label uk-align-right">
																original
															</span>
															<span class="uk-label uk-align-right" v-else>
																new
															</span>
														</div>
													</td>
											</tr>
											<tr>
												<th style="vertical-align:middle;">Entity Type</th>
												<td>{{ eventMessage.event.EntityType.text }}</td>
											</tr>
											<tr>
												<th style="vertical-align:middle;">Entity Name</th>
												<td>{{ eventMessage.event.EntityName.value }}</td>
											</tr>
											<tr>
												<th style="vertical-align:middle;">Profilename</th>
												<td>{{ eventMessage.event.ProfileName.value }}</td>
											</tr>
										</template>
								</tbody>
						</table>
					</div>
				</div>
    </div>
</template>

<script>
	import UIkit from 'uikit';

	var Worker = require("worker-loader!./worker");
	import config from 'config';

  export default {
    props : [
        'queuemanagerName',
        'queueName'
    ],
    data() {
        return {
            browsed : false,
            limit : 100,
						ws : null,
						worker : new Worker(),
						eventMessage : null,
						relatedMessage : null
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
				count() {
					return this.$store.getters['messageModule/count'];
				},
        warnAboutQDepth() {
          return this.queueDepth > 100;
        },
        messages() {
          return this.$store.getters['messageModule/messages'];
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
					this.$store.dispatch('messageModule/browseMessages', { queuemanagerName : this.queuemanagerName, queueName : this.queueName, limit : this.limit });
				},
				showEventMessage(msgId) {
					this.eventMessage = this.$store.getters['messageModule/getMessage'](msgId);
					this.relatedMessage = this.getRelatedEventMessage(this.eventMessage);
					UIkit.modal(this.$refs.eventDialog).show();
				},
				getRelatedEventMessage(message) {
					var relatedMessages = this.$store.getters['messageModule/getMessageWithCorrelationId'](message.mqmd.CorrelId);
					var searchMsgSeqNumber = message.event.MsgSeqNumber == 1 ? 2 : 1;
					if (relatedMessages.length == 2) {
						for(var m in relatedMessages) {
							if ( relatedMessages[m].event.MsgSeqNumber == searchMsgSeqNumber ) {
								return relatedMessages[m];
							}
						}
					}
					return null;
				}
    }
  }
</script>
