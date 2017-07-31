<template>
    <div class="uk-offcanvas-content">
        <div uk-sticky="media: 960" class="uk-navbar-container uk-sticky uk-light"
            style="background-image:linear-gradient(to left, #28a5f5, #1e87f0)">
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

        <slot name="content"></slot>

        <section class="uk-section uk-container uk-container-expand uk-section-secondary">
            <span>&copy; <a href="http://www.mqweb.org">MQWeb</a></span>
        </section>
    </div>
</template>

<script>
  export default {
      data() {
          return {};
      }
  };
</script>
