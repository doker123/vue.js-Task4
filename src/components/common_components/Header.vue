<template>
  <header class="main-header">
      <div class="container">
        <div class="header-content">
          <router-link to="/" class="logo">
            <h1>Просто купить</h1>
          </router-link>

          <nav class="main-nav">
            <router-link to="/" class="nav-item" active-class="active">Каталог</router-link>
            <template v-if="isAuthenticated">
              <router-link to="/cart" class="nav-item" active-class="active">Карзина</router-link>
            </template>

            <template v-if="isAuthenticated">
              <router-link to="/orders" class="nav-item" active-class="active">Заказы</router-link>
              <a @click.prevent="handleLogout" class="nav-item logout">Выйти</a>
            </template>

            <template v-else>
              <router-link to="/login" class="nav-item" active-class="active">Вход</router-link>
              <router-link to="/register" class="nav-item" active-class="active">Регистрация</router-link>
            </template>
          </nav>
        </div>
      </div>
    </header>
</template>

<script>
import { mapGetters, mapActions} from "vuex";
export default {
  name: "Header",
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  methods: {
    ...mapActions(['logout']),
    async handleLogout() {
      try {
        await this.logout();
        this.$router.push('/');
      } catch (error) {
        console.log('Ошибка при выходе:', error);
      }
    }
  }
}
</script>

<style scoped>
.main-header {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  height: 60px;
}

.logo {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #42b883;
}

.main-nav {
  display: flex;
  gap: 25px;
  align-items: center;
}

.nav-item {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  padding: 5px 0;
  position: relative;
  transition: color 0.3s;
}

.nav-item:hover {
  color: #42b883;
}

.nav-item.active {
  color: #42b883;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #42b883;
}

.logout {
  cursor: pointer;
  color: #e53935;
}

.logout:hover {
  color: #c62828;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 15px;
    height: auto;
    padding: 15px 0;
  }

  .main-nav {
    width: 100%;
    justify-content: space-between;
    gap: 10px;
  }

  .nav-item {
    font-size: 0.9rem;
    padding: 3px 0;
  }

  .logo h1 {
    font-size: 1.3rem;
  }
}
</style>