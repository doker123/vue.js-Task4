<template>
  <div class="cart">
    <h2>Корзина</h2>

    <div v-if="cart.length === 0" class="empty-cart">
      <p>Ваша корзина пуста</p>
      <router-link to="/" class="back-to-catalog">Перейти к каталогу</router-link>
    </div>

    <div v-else class="cart-items">
      <div v-for="item in cart" :key="item.id" class="cart-item">
        <div class="cart-item-image">
          <img :src="getImageUrl(item.image)" :alt="item.name" @error="handleImageError">
          <div class="placeholder">{{ item.name.charAt(0) }}</div>
        </div>

        <div class="cart-item-info">
          <h3>{{ item.name }}</h3>
          <p class="description">{{ item.description }}</p>
          <p class="price">₽ {{ item.price }}</p>
        </div>

        <div class="cart-item-controls">
          <div class="quantity-controls">
            <button @click="decreaseQuantity(item.id)" class="qty-btn" :disabled="item.quantity <= 1">−</button>
            <span class="quantity">{{ item.quantity }}</span>
            <button @click="increaseQuantity(item.id)" class="qty-btn">+</button>
          </div>

          <button @click="removeFromCart(item.id)" class="remove-btn">
            Удалить
          </button>
        </div>

        <div class="cart-item-total">
          <span>Итого:</span>
          <strong>₽ {{ item.price * item.quantity }}</strong>
        </div>
      </div>

      <div class="cart-summary">
        <div class="summary-row">
          <span>Товаров:</span>
          <span>{{ cartCount }}</span>
        </div>
        <div class="summary-row total">
          <span>Общая сумма:</span>
          <span><strong>₽ {{ cartTotal }}</strong></span>
        </div>
        <button @click="checkout" class="checkout-btn" :disabled="isCheckingOut">
          {{ isCheckingOut ? 'Оформление...' : 'Оформить заказ' }}
        </button>
      </div>
    </div>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://lifestealer86.ru/api-shop';

export default {
  name: 'Cart',
  data() {
    return {
      isCheckingOut: false,
      successMessage: '',
      errorMessage: ''
    };
  },
  computed: {
    ...mapGetters(['cart', 'cartTotal', 'cartCount', 'isAuthenticated'])
  },
  methods: {
    ...mapActions(['addToCart', 'removeFromCart', 'updateCartQuantity', 'clearCart', 'createOrder']),
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }
      return `${API_BASE_URL}${imagePath}`;
    },
    handleImageError(e) {
      e.target.style.display = 'none';
    },
    increaseQuantity(productId) {
      const item = this.cart.find(item => item.id === productId);
      if (item) {
        this.updateCartQuantity({ productId, quantity: item.quantity + 1 });
      }
    },
    decreaseQuantity(productId) {
      const item = this.cart.find(item => item.id === productId);
      if (item && item.quantity > 1) {
        this.updateCartQuantity({ productId, quantity: item.quantity - 1 });
      }
    },
    async checkout() {
      this.isCheckingOut = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        if (!this.isAuthenticated) {
          throw new Error('Необходимо авторизоваться для оформления заказа');
        }

        await this.createOrder();
        console.log('Заказ успешно оформлен');
        this.successMessage = 'Заказ успешно оформлен! Перенаправление...';
        setTimeout(() => {
          this.$router.push('/orders');
        }, 1500);
      } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        this.errorMessage = error.message || error.error?.message || 'Ошибка при оформлении заказа';
      } finally {
        this.isCheckingOut = false;
      }
    }
  }
};
</script>

<style scoped>
.cart {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.cart h2 {
  margin-bottom: 25px;
  color: #333;
  font-size: 1.8rem;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.empty-cart p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
}

.back-to-catalog {
  display: inline-block;
  padding: 12px 24px;
  background-color: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.back-to-catalog:hover {
  background-color: #3aa97a;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto;
  gap: 20px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s;
}

.cart-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.cart-item-image {
  position: relative;
  width: 100px;
  height: 100px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-item-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.cart-item-image .placeholder {
  font-size: 40px;
  color: #42b883;
  font-weight: bold;
  opacity: 0.3;
}

.cart-item-info h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.1rem;
}

.cart-item-info .description {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cart-item-info .price {
  color: #42b883;
  font-weight: bold;
  font-size: 1.1rem;
  margin: 0;
}

.cart-item-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background-color: #f8f9fa;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.qty-btn:hover:not(:disabled) {
  background-color: #42b883;
  color: white;
  border-color: #42b883;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  font-size: 1.1rem;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.remove-btn {
  padding: 6px 12px;
  background-color: #ffebee;
  color: #c62828;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.remove-btn:hover {
  background-color: #c62828;
  color: white;
}

.cart-item-total {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.cart-item-total span:first-child {
  font-size: 0.9rem;
  color: #666;
}

.cart-item-total strong {
  font-size: 1.3rem;
  color: #42b883;
}

.cart-summary {
  margin-top: 20px;
  padding: 25px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 1rem;
  color: #555;
}

.summary-row.total {
  border-top: 2px solid #ddd;
  margin-top: 10px;
  padding-top: 15px;
  font-size: 1.2rem;
  color: #333;
}

.checkout-btn {
  width: 100%;
  margin-top: 20px;
  padding: 15px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(66, 184, 131, 0.3);
}

.checkout-btn:hover:not(:disabled) {
  background-color: #3aa97a;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(66, 184, 131, 0.4);
}

.checkout-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.success-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #42b883;
  color: white;
  padding: 15px 25px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.4);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.error-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #e53935;
  color: white;
  padding: 15px 25px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(229, 57, 53, 0.4);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 80px 1fr;
    grid-template-rows: auto auto;
  }

  .cart-item-controls,
  .cart-item-total {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
  }

  .cart-item-total {
    order: -1;
  }
}
</style>
