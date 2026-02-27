<template>
  <div class="orders">
    <h2>Мои заказы</h2>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка заказов...</p>
    </div>

    <div v-else-if="displayableOrders.length === 0" class="empty-orders">
      <p>У вас пока нет оформленных заказов</p>
      <router-link to="/" class="back-to-catalog">Перейти к каталогу</router-link>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in displayableOrders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-info">
            <h3>Заказ № {{ order.id }}</h3>
            <p class="order-date">{{ formatDate(order.createdAt) }}</p> <!-- или просто '-' если нет даты -->
          </div>
          <div class="order-status">
            <span :class="['status-badge', getStatusClass(order.status)]">
              {{ getStatusText(order.status) }}
            </span>
          </div>
        </div>

        <div class="order-items">

          <div v-for="(item, index) in order.groupedItems" :key="`${order.id}-${item.productId}-${index}`" class="order-item">
            <div class="item-info">

              <span class="item-name">{{ getProductInfo(item.productId).name || `Товар ${item.productId}` }}</span>
              <span class="item-quantity">× {{ item.quantity }}</span>
            </div>
            <div class="item-price">
              ₽ {{ item.totalPrice }}
            </div>
          </div>
        </div>

        <div class="order-total">
          <span>Итого:</span>
          <strong>₽ {{ order.total }}</strong>
        </div>
      </div>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Orders',
  data() {
    return {
      loading: false,
      errorMessage: ''
    };
  },
  computed: {
    ...mapGetters(['orders', 'isAuthenticated', 'products']),


    displayableOrders() {

      return this.orders.map(apiOrder => {
        // Группируем ID товаров
        const groupedProducts = {};
        apiOrder.products.forEach(productId => {
          if (groupedProducts[productId]) {
            groupedProducts[productId]++;
          } else {
            groupedProducts[productId] = 1;
          }
        });


        const groupedItems = Object.entries(groupedProducts).map(([productIdStr, quantity]) => {
          const productId = parseInt(productIdStr);
          const productInfo = this.getProductInfo(productId);
          return {
            productId: productId,
            name: productInfo.name,
            price: productInfo.price,
            quantity: quantity,
            totalPrice: productInfo.price * quantity
          };
        });


        return {
          id: apiOrder.id,

          groupedItems: groupedItems,
          total: apiOrder.order_price
        };
      });
    }
  },
  async created() {
    await this.loadOrdersData();
  },
  methods: {
    ...mapActions(['loadOrders']),
    async loadOrdersData() {
      this.loading = true;
      this.errorMessage = '';

      try {
        await this.loadOrders();

        await this.$store.dispatch('loadProducts');
      } catch (error) {
        this.errorMessage = error.message || 'Ошибка при загрузке заказов';
        console.error('Load orders error:', error);
      } finally {
        this.loading = false;
      }
    },

    getProductInfo(productId) {
      const product = this.products.find(p => p.id === productId);
      return product || { name: `Товар ${productId}`, price: 0 };
    },
    formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    getStatusClass(status) {

      const statusMap = {
        'new': 'status-new',
        'pending': 'status-pending',
        'processing': 'status-processing',
        'shipped': 'status-shipped',
        'delivered': 'status-delivered',
        'cancelled': 'status-cancelled',
        'completed': 'status-delivered'
      };
      return statusMap[status] || 'status-delivered';
    },
    getStatusText(status) {
      const statusTextMap = {
        'new': 'Новый',
        'pending': 'В обработке',
        'processing': 'Обрабатывается',
        'shipped': 'Отправлен',
        'delivered': 'Доставлен',
        'cancelled': 'Отменён',
        'completed': 'Выполнен'
      };
      return statusTextMap[status] || 'Новый';
    }
  }
};
</script>

<style scoped>
.orders {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.orders h2 {
  margin-bottom: 25px;
  color: #333;
  font-size: 1.8rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #42b883;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-orders {
  text-align: center;
  padding: 60px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.empty-orders p {
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

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s;
}

.order-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.order-info h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.order-date {
  margin: 5px 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-new {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-pending,
.status-processing {
  background-color: #fff3e0;
  color: #f57c00;
}

.status-shipped {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.status-delivered {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-cancelled {
  background-color: #ffebee;
  color: #c62828;
}

.order-items {
  padding: 20px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  gap: 15px;
  align-items: center;
}

.item-name {
  color: #333;
  font-size: 1rem;
}

.item-quantity {
  color: #666;
  font-size: 0.95rem;
}

.item-price {
  color: #42b883;
  font-weight: 600;
  font-size: 1rem;
}

.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  font-size: 1.1rem;
}

.order-total strong {
  color: #42b883;
  font-size: 1.3rem;
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
  .order-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .order-total {
    flex-direction: column;
    gap: 5px;
    align-items: flex-start;
  }
}
</style>
