<template>
    <div class="uk-alert uk-alert-danger uk-text-small">
        The MQ action failed with reason code <span class="uk-text-bold uk-text-nowrap">{{ error.reason.code }} - {{ error.reason.desc }}</span>.
        If the problem persists, contact your Websphere MQ administration team.
    </div>
</template>

<script>
    export default {
        props : [ 'error' ]
    };
</script>
