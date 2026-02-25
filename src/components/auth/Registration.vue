<template>
  <div class="register-container">
    <h1>Регистрация</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="fio">ФИО</label>
        <input type="text" id="fio" v-model="fio" @blur="validateFio">
        <span v-if="errors.fio" class="error">{{ errors.fio }}</span>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" @blur="validateEmail">
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label for="password">Пароль</label>
        <input type="password" id="password" v-model="password" @blur="validatePassword">
        <span v-if="errors.password" class="error">{{ errors.password }}</span>
      </div>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <button type="submit" :disabled="isSubmitting">Зарегистрироваться</button>
    </form>

    <div class="links">
      <router-link to="/login">Вход в систему</router-link>
      <router-link to="/">На главную</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Registration',
  data() {
    return {
      fio: '',
      email: '',
      password: '',
      errors: {},
      errorMessage: ''
    }
  },
  methods: {
    validateFio() {
      if (!this.fio) {
        this.errors.fio = 'Введите ФИО';
      } else {
        this.errors.fio = '';
      }

    },
    validateEmail() {
      if (!this.email) {
        this.errors.email = "Введите почту"
      } else {
        this.errors.email = '';
      }
    }
  },
}
</script>

<style>

</style>