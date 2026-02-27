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

          <button @click="removeFromCart(item.id)" class="remove-btn"> <!-- item.id -->
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
  async created() {

    if (this.isAuthenticated) {
      try {
        await this.loadCart();
      } catch (error) {
        console.error('Не удалось загрузить корзину:', error);
        this.errorMessage = 'Не удалось загрузить содержимое корзины.';
      }
    }
  },
  methods: {

    ...mapActions(['loadCart', 'removeFromCart', 'createOrder', 'addToCart']),
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

    async increaseQuantity(cartItemId) {
      const item = this.cart.find(i => i.id === cartItemId);
      if (item) {
        try {
          await this.addToCart(item.productId);
          await this.loadCart();
        } catch (error) {
          console.error('Ошибка при увеличении количества:', error);
          this.errorMessage = 'Не удалось увеличить количество.';
        }
      }
    },

    async decreaseQuantity(cartItemId) {
      const item = this.cart.find(i => i.id === cartItemId);
      if (item && item.quantity > 1) {
        try {
          // Если quantity > 1, удаляем одну запись товара из корзины
          await this.removeFromCart(cartItemId);
          await this.loadCart();
        } catch (error) {
          console.error('Ошибка при уменьшении количества:', error);
          this.errorMessage = 'Не удалось уменьшить количество.';
        }
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
  max-width: 1200px;
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
  background: linear-gradient(135deg, #42b883 0%, #3aa97a 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-to-catalog:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 184, 131, 0.4);
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto auto;
  gap: 20px;
  align-items: center;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.cart-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.cart-item-image {
  position: relative;
  width: 120px;
  height: 120px;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cart-item-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s;
}

.cart-item-image .placeholder {
  font-size: 40px;
  color: #42b883;
  font-weight: bold;
  opacity: 0.3;
}

.cart-item:hover .cart-item-image img {
  transform: scale(1.05);
}

.cart-item-info h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.cart-item-info .description {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.cart-item-info .price {
  color: #42b883;
  font-weight: 700;
  font-size: 1.2rem;
  margin: 0;
}

.cart-item-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f8f9fa;
  padding: 5px 10px;
  border-radius: 8px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: linear-gradient(135deg, #42b883 0%, #3aa97a 100%);
  color: white;
  border-radius: 6px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.4);
}

.qty-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.quantity {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  min-width: 30px;
  text-align: center;
}

.remove-btn {
  padding: 8px 16px;
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background-color: #e53935;
  color: white;
  border-color: #e53935;
}

.cart-item-total {
  text-align: right;
  min-width: 120px;
}

.cart-item-total span {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.cart-item-total strong {
  color: #42b883;
  font-size: 1.3rem;
}

.cart-summary {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  border: 1px solid #e0e0e0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 1rem;
  color: #555;
}

.summary-row.total {
  border-top: 2px solid #e0e0e0;
  margin-top: 10px;
  padding-top: 15px;
  font-size: 1.2rem;
  color: #333;
}

.summary-row.total strong {
  color: #42b883;
  font-size: 1.4rem;
}

.checkout-btn {
  width: 100%;
  padding: 14px;
  margin-top: 20px;
  background: linear-gradient(135deg, #42b883 0%, #3aa97a 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 184, 131, 0.4);
}

.checkout-btn:disabled {
  background: linear-gradient(135deg, #ccc 0%, #bbb 100%);
  cursor: not-allowed;
  opacity: 0.7;
}

.error-message,
.success-message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  border-left: 4px solid #e53935;
}

.success-message {
  background-color: #e8f5e9;
  color: #388e3c;
  border-left: 4px solid #42b883;
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

@media (max-width: 900px) {
  .cart-item {
    grid-template-columns: 100px 1fr;
    grid-template-rows: auto auto;
  }

  .cart-item-image {
    grid-row: 1 / 3;
    width: 100px;
    height: 100px;
  }

  .cart-item-controls {
    grid-column: 2;
    flex-direction: row;
    justify-content: flex-start;
  }

  .cart-item-total {
    grid-column: 2;
    text-align: left;
  }
}

@media (max-width: 480px) {
  .cart {
    padding: 15px;
  }

  .cart h2 {
    font-size: 1.5rem;
  }

  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 15px;
    padding: 15px;
  }

  .cart-item-image {
    width: 80px;
    height: 80px;
  }

  .cart-item-info h3 {
    font-size: 1rem;
  }

  .cart-item-info .price {
    font-size: 1.1rem;
  }

  .qty-btn {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }

  .summary-row.total {
    font-size: 1rem;
  }

  .summary-row.total strong {
    font-size: 1.2rem;
  }
}
</style>