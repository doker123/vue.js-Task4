<template>
  <div class="register-container">
    <h1>Регистрация</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="fio">ФИО</label>
        <input type="text" id="fio" v-model="fio" @blur="validateFio" required>
        <span v-if="errors.fio" class="error">{{ errors.fio }}</span>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" @blur="validateEmail" required>
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input type="password" id="password" v-model="password" @blur="validatePassword" required>
        <span v-if="errors.password" class="error">{{ errors.password }}</span>
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      <button type="submit">Зарегистрироваться</button>
    </form>
    <div class="links">
      <router-link to="/login">Войти в систему</router-link>
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
      errorMessage: '',
      successMessage: ''
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

      } else if (!/^\S+@\S+\.\S+$/.test(this.email)) {
        this.errors.email = 'Некоректный формат почты'
      } else {
        this.errors.email = '';
      }
    },
    validatePassword() {
      if (!this.password) {
        this.errors.password = 'Пароль обязателен для заполнения';
      } else if (this.password.length < 8) {
        this.errors.password = 'Пароль больше 8 символов';
      } else {
        this.errors.password = '';
      }
    },
    validateForm() {
      this.validateFio();
      this.validateEmail();
      this.validatePassword();

      return !Object.values(this.errors).some(error => error);
    },
    async handleSubmit() {
      this.errorMessage = '';
      this.successMessage = '';

      if (this.validateForm()) {
        try {
          const  success = await this.$store.dispatch('register', {
            fio: this.fio,
            email: this.email,
            password: this.password,
          });
          if (success) {
            this.successMessage = 'Регистрация прошла успешно! Вы будете перенаправлены на страницу входа ';
            setTimeout (() => {
              this.$router.push('/login');
            }, 2000);
          } else {
            this.errorMessage = 'Ошибка при регистрации. Попробуйте позже.';
          }
        } catch (error) {
          this.handleApiErrors(error);
        }
      }
    },
    handleApiErrors(error) {
      if (error.errors) {
        if (error.errors.fio) {
          this.errors.fio = error.errors.fio[0];
        }
        if (error.errors.email) {
          this.errors.email = error.errors.email[0];
        }
        if (error.errors.password) {
          this.errors.password = error.errors.password[0];
        }
      } else {
        this.errorMessage = error.message || 'Ошибка регистрации';
      }
    }
  }
}
</script>

<style>
.register-container {
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
  border: 1px solid #ddd;
  border-radius: 4px;
}
input:invalid {
  border-color: #ff6b6b;
}
input:valid {
  border-color: #42b883;
}
.error {
  color: #ff6b6b;
  font-size: 0.8em;
  display: block;
  margin-top: 5px;
}
.error-message {
  color: #ff6b6b;
  margin-bottom: 10px;
  padding: 8px;
  background-color: #fff0f0;
  border-radius: 4px;
}
.success-message {
  color: #42b883;
  margin-bottom: 10px;
  padding: 8px;
  background-color: #f0fff4;
  border-radius: 4px;
}
button {
  padding: 10px 15px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;
}
button:hover {
  background-color: #3aa97a;
}
button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
.links {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}
.links a {
  color: #42b883;
  text-decoration: none;
}
.links a:hover {
  text-decoration: underline;
}
</style>