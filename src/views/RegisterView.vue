<template>
  <div class="register-page">
    <Register />
  </div>
</template>
<script>
import Register from "@/components/auth/Registration.vue"
export default {
  name: "RegisterView",
  components: {
    Register
  }
}
</script>