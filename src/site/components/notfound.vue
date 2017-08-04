<template>
    <site>
        <div slot="content">
            <section class="uk-section uk-container uk-container-expand">
                <div class="uk-alert uk-alert-danger">
                    {{ message }}
                </div>
            </section>
        </div>
    </site>
</template>

<script>
    import Site from './site.vue';

    export default {
        components : {
            Site
        },
        props : [ 'message'],
        mounted() {
            window.setTimeout(function() {
                window.location.href = '/';
            }, 5000);
        }
    }
</script>
