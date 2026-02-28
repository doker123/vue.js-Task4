<template>
  <div class="products-container">

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка товаров...</p>
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="!loading && !error && products.length > 0" class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-image">
          <img :src="getImageUrl(product.image)" :alt="product.name" @error="handleImageError">
          <div class="placeholder">{{ product.name.charAt(0) }}</div>
        </div>
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="description">{{ product.description }}</p>
          <p class="price">₽ {{ product.price }}</p>
        </div>
        <button v-if="isAuthenticated" @click="handleAddToCart(product.id)" class="add-to-cart">
          <span>Добавить в корзину</span>
        </button>
      </div>
    </div>

    <div v-if="!loading && !error && products.length === 0" class="empty-state">
      <p>Каталог товаров пуст</p>
    </div>
  </div>
</template>

<script>
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://lifestealer86.ru/api-shop';

export default {
  name: 'Product',
  async created() {
    try {
      await this.$store.dispatch('loadProducts')
    } catch (error) {
      console.log("Ошибка при загрузке товаров: ", error);
    }
  },
  computed: {
    products() {
      return this.$store.getters.products;
    },
    loading() {
      return this.$store.getters.isLoading;
    },
    error() {
      return this.$store.getters.error;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    }
  },
  methods: {
    async handleAddToCart(productId) {
      if (!this.$store.getters.isAuthenticated) {
        console.warn('Пользователь не авторизован. Перенаправление на логин...');
        this.$router.push('/login');
        return;
      }

      this.loading = true;
      try {
        await this.$store.dispatch('addToCart', productId);
      } catch (error) {
        console.error('Ошибка в компоненте при добавлении в корзину:', error);

        let errorMessage = 'Не удалось добавить товар в корзину.';
        if (error.error && error.error.message) {

          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
      } finally {
        this.loading = false;
      }
    },
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }
      return `${API_BASE_URL}${imagePath}`;
    },
    handleImageError(e) {
      e.target.style.display = 'none';
    }
  },
}
</script>

<style scoped>
.products-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #42b883;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  background-color: #ffebee;
  color: #b71c1c;
  padding: 15px;
  border-radius: 4px;
  margin: 20px 0;
  border-left: 4px solid #b71c1c;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 20px 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 20px;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-color: #ddd;
}

.product-image {
  position: relative;
  height: 200px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s;
}

.product-image .placeholder {
  font-size: 60px;
  color: #42b883;
  font-weight: bold;
  opacity: 0.3;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-info h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.description {
  color: #666;
  margin: 8px 0;
  font-size: 0.95rem;
  line-height: 1.4;
  flex-grow: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.price {
  font-weight: bold;
  color: #42b883;
  font-size: 1.3rem;
  margin: 12px 0;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 15px;
  }

  .product-card {
    margin-bottom: 15px;
  }
}


@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-card {
  animation: fadeIn 0.3s ease forwards;
}

.add-to-cart {
   width: 100%;
   padding: 14px 20px;
   margin: 0;
   background: linear-gradient(135deg, #42b883 0%, #3aa97a 100%);
   color: white;
   border: none;
   border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
   cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-to-cart:hover {
   transform: translateY(-2px);
   box-shadow: 0 6px 20px rgba(66, 184, 131, 0.4);
}

.add-to-cart:active {
  transform: translateY(0);
}
</style>
