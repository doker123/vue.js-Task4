<template>
  <div class="login-page">
    <Login />
  </div>
</template>
<script>
import Login from "@/components/auth/Login.vue";

export default {
  name: 'LoginView',
  components: {
    Login
  }
}
</script>