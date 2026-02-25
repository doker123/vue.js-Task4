<template>
  <div class="register-page">
    <register>

    </register>
  </div>
</template>
<script>
import Register from "@/components/auth/Registration.vue"
export default {
  name: "RegisterView",
  components: {
    register:Register
  }
}
</script>