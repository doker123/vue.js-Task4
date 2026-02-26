<template>
  <div id="app">
    <Header />
    <router-view></router-view>
  </div>
</template>
<script>
import Header from "@/components/common_components/Header.vue";

export default {
  name: 'App',
  components: {
    Header,
  }
}
</script>