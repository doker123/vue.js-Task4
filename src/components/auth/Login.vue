<template>
  <div class="login-container">
    <div class="form-card">
      <h1 class="title">Вход в систему</h1>
      
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email" class="label">
            <span class="label-icon">📧</span>
            Email
          </label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            :class="['input', { 'input-error': errors.email }]"
            @blur="validateEmail"
            placeholder="example@mail.ru"
            required
          >
          <transition name="fade">
            <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
          </transition>
        </div>

        <div class="form-group">
          <label for="password" class="label">
            <span class="label-icon">🔒</span>
            Пароль
          </label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            :class="['input', { 'input-error': errors.password }]"
            @blur="validatePassword"
            placeholder="••••••••"
            required
          >
          <transition name="fade">
            <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
          </transition>
        </div>

        <transition name="fade">
          <div v-if="errorMessage" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ errorMessage }}
          </div>
        </transition>

        <button type="submit" class="submit-btn" :disabled="isLoading || !isFormValid">
          <span v-if="isLoading" class="spinner-small"></span>
          {{ isLoading ? 'Вход...' : 'Войти' }}
        </button>
      </form>

      <div class="links">
        <router-link to="/register" class="link">
          <span class="link-icon">📝</span>
          Регистрация
        </router-link>
        <router-link to="/" class="link">
          <span class="link-icon">🏠</span>
          На главную
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      errors: {},
      errorMessage: '',
      isLoading: false,
      touched: {
        email: false,
        password: false
      }
    };
  },
  computed: {
    isFormValid() {
      return this.email && this.password && !this.errors.email && !this.errors.password;
    }
  },
  methods: {
    validateEmail() {
      this.touched.email = true;
      if (!this.email) {
        this.errors.email = 'Введите email';
      } else if (!/^\S+@\S+\.\S+$/.test(this.email)) {
        this.errors.email = 'Некорректный email';
      } else {
        this.errors.email = '';
      }
    },
    validatePassword() {
      this.touched.password = true;
      if (!this.password) {
        this.errors.password = 'Введите пароль';
      } else if (this.password.length < 1) {
        this.errors.password = 'Пароль не может быть пустым';
      } else {
        this.errors.password = '';
      }
    },
    async handleSubmit() {
      this.errors = {};
      this.errorMessage = '';
      this.validateEmail();
      this.validatePassword();

      if (!this.isFormValid) return;

      this.isLoading = true;

      try {
        const success = await this.$store.dispatch('login', {
          email: this.email,
          password: this.password,
        });
        
        if (success) {
          const redirect = this.$route.query.redirect || '/';
          this.$router.push(redirect);
        } else {
          this.errorMessage = 'Неправильный email или пароль';
        }
      } catch (error) {
        console.error('Login error:', error);
        this.errorMessage = error.message || 'Ошибка при входе. Попробуйте позже';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.form-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.title {
  margin: 0 0 30px 0;
  font-size: 1.8rem;
  color: #333;
  text-align: center;
  font-weight: 700;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #555;
  font-size: 0.95rem;
}

.label-icon {
  font-size: 1.1rem;
}

.input {
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

.input:focus {
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.input-error {
  border-color: #ff6b6b;
  animation: shake 0.3s ease;
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-text {
  color: #ff6b6b;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.error-message {
  background-color: #fff0f0;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 4px solid #c62828;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
}

.error-icon {
  font-size: 1.2rem;
}

.submit-btn {
  padding: 14px;
  background: linear-gradient(135deg, #42b883 0%, #3aa97a 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 184, 131, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: linear-gradient(135deg, #ccc 0%, #bbb 100%);
  cursor: not-allowed;
  opacity: 0.7;
}

.spinner-small {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.links {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.link {
  color: #42b883;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.link:hover {
  color: #3aa97a;
  transform: translateX(3px);
}

.link-icon {
  font-size: 1rem;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .form-card {
    padding: 30px 20px;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .links {
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }
}
</style>
