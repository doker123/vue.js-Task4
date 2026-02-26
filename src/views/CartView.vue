<template>
  <div class="cart-page">
    <div class="page-header">
      <router-link to="/" class="back-btn">
        <span class="back-icon">←</span>
        Назад к каталогу
      </router-link>
    </div>
    <Cart />
  </div>
</template>

<script>
import Cart from '@/components/products/Cart.vue';

export default {
  name: 'CartView',
  components: {
    Cart
  }
};
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.page-header {
  max-width: 1000px;
  margin: 0 auto 20px auto;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #42b883;
  text-decoration: none;
  font-weight: 500;
  padding: 10px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.back-btn:hover {
  background-color: rgba(66, 184, 131, 0.1);
  transform: translateX(-5px);
}

.back-icon {
  font-size: 1.3rem;
  font-weight: bold;
}

.page-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

@media (max-width: 768px) {
  .cart-page {
    padding: 15px;
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
}
</style>
