<template>
  <div class="login-container">
    <h1>Вход в систему</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required>
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input type="password" id="password" v-model="password" required>
        <span v-if="errors.password" class="error">{{ errors.password }}</span>
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <button type="submit">Войти</button>
    </form>
    <div class="links">
      <router-link to="/register">Регистрация</router-link>
      <router-link to="/">На главную</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      errors: {},
      errorMessage: "",
    }
  },
  methods: {
    async handleSubmit() {
      this.errors = {};
      this.errorMessage = '';

      if (!this.email) {
        this.errors.email = 'Введите email';
      } else if (!/^\S+@\S+\.\S+/.test(this.email)) {
        this.errors.email = 'Некорректный email';
      }

      if (!this.password) {
        this.errors.password = 'Ввведите пароль';
      }
      if (Object.keys(this.errors).length === 0) {
        try {
          const success = await this.$store.dispatch('login', {
            email: this.email,
            password: this.password,
          });
          if (success) {
            this.router.push('/');
          } else  {
            this.errorMessage = 'Неправильный email или пароль'
          }
        } catch (error) {
          this.errorMessage = 'Ошибка при входе. Попробуйте позже '
        }
      }
    }
  },
}

</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
.form-group {
  margin-bottom: 15px;
}
input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}
.error {
  color: red;
  font-size: 12px;
  display: block;
  margin-top: 5px;
}
.error-message {
  color: red;
  margin-bottom: 10px;
}
button {
  padding: 10px 15px;
  background-color: #42b883;
  color: white;
  border: none;
  cursor: pointer;
}
.links {
  margin-top: 15px;
}
.links a {
  margin-right: 10px;
  color: #42b883;
}
</style>