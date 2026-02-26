<template>
  <div class="home-page">
    <!-- Каталог товаров -->
    <Product />
  </div>
</template>

<script>
import Product from '@/components/products/Product.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'HomeView',
  components: {
    Product
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  }
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.auth-prompt {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  margin-bottom: 30px;
}

.auth-prompt-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  color: white;
}

.auth-prompt-content h2 {
  font-size: 2rem;
  margin: 0 0 15px 0;
  font-weight: 700;
}

.auth-prompt-content p {
  font-size: 1.1rem;
  margin: 0 0 25px 0;
  opacity: 0.95;
}

.auth-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-icon {
  font-size: 1.2rem;
}

.btn-login {
  background-color: white;
  color: #667eea;
}

.btn-login:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.btn-register {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.btn-register:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

@media (max-width: 600px) {
  .auth-prompt-content h2 {
    font-size: 1.5rem;
  }
  
  .auth-prompt-content p {
    font-size: 1rem;
  }
  
  .auth-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 250px;
    justify-content: center;
  }
}
</style>
