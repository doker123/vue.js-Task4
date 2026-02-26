import { createStore } from 'vuex'
import { login as apiLogin } from "@/utils/api";
import { register as apiRegister } from "@/utils/api";
import { getProducts, createOrder, getOrders } from "@/utils/api";

export default createStore({
    state: {
        token: localStorage.getItem("user_token") || null,
        user: null,
        products: [],
        cart: JSON.parse(localStorage.getItem("cart")),
        orders: [],
        loading: false,
        error: null,
    },
    getters: {
        isAuthenticated: state => !!state.token,
        products: state => state.products,
        isLoading: state => state.loading,
        error: state => state.error,
        cart: state => state.cart,
        cartTotal: state => {
            return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
        },
        cartCount: state => {
            return state.cart.reduce((count, item) => count + item.quantity, 0);
        },
        orders: state => state.orders,
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
            if (token) {
                localStorage.setItem("user_token", token);
            } else {
                localStorage.removeItem("user_token");
            }
        },
        ClEAR_AUTH: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem("user_token");
        },
        SET_PRODUCTS (state, products) {
            state.products = products;
        },
        SET_LOADING (state, loading) {
            state.loading = loading;
        },
        SET_ERROR (state, error) {
            state.error = error;
        },
        ADD_TO_CART (state, product) {
            console.log('Мутация ADD_TO_CART:', product);
            const productId = product.id || product.productId;
            if (!productId) {
                console.error('Нет id у продукта:', product);
                return;
            }
            const existingItem = state.cart.find(item => (item.id || item.productId) === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                state.cart.push({
                    id: productId,
                    productId: productId,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    description: product.description,
                    quantity: 1
                });
            }
            localStorage.setItem("cart", JSON.stringify(state.cart));
            // Синхронизируем с sessionStorage для сервера
            sessionStorage.setItem("cart", JSON.stringify(state.cart));
        },
        REMOVE_FROM_CART (state, productId) {
            state.cart = state.cart.filter(item => item.id !== productId);
            localStorage.setItem("cart", JSON.stringify(state.cart));
            sessionStorage.setItem("cart", JSON.stringify(state.cart));
        },
        UPDATE_CART_QUANTITY (state, { productId, quantity }) {
            const item = state.cart.find(item => item.id === productId);
            if (item) {
                if (quantity <= 0) {
                    state.cart = state.cart.filter(item => item.id !== productId);
                } else {
                    item.quantity = quantity;
                }
                localStorage.setItem("cart", JSON.stringify(state.cart));
                sessionStorage.setItem("cart", JSON.stringify(state.cart));
            }
        },
        CLEAR_CART (state) {
            state.cart = [];
            localStorage.removeItem("cart");
            sessionStorage.removeItem("cart");
        },
        SET_ORDERS (state, orders) {
            state.orders = orders;
        },
    },
    actions: {
        async loadProducts({ commit }) {
            commit("SET_LOADING", true);
            commit("SET_ERROR", null);

            try {
                const res= await getProducts();
                commit("SET_PRODUCTS", res.data);
                return true;
            } catch (error) {
                commit("SET_ERROR", error.message || 'Ошибка при загрузке продуктов.');
                console.error('Ошибка загрузки товаров:', error);
                return false;

            } finally {
                commit("SET_LOADING", false);
            }
        },
        async login({ commit}, {email, password}) {
            try {
                const response = await apiLogin(email, password);
                const token = response.data.user_token;
                if (!token) {
                    throw new Error('Токен не получен от сервера');
                }
                commit("SET_TOKEN", token);
                return true;
            } catch (error) {
                console.error('Login failed:', error);
                return false;
            }
        },
        async logout({ commit }) {
            commit('ClEAR_AUTH');
        },
        async register({ commit }, {fio, email, password}) {
            try {
                const response = await apiRegister(fio, email, password);
                console.log('Register response:', response);
                commit('SET_TOKEN', response.data.user_token);
                return true;
            } catch (error) {
                console.error('Register failed:', error);
                throw error;
            }
        },
        addToCart({ commit }, product) {
            commit('ADD_TO_CART', product);
        },
        removeFromCart({ commit }, productId) {
            commit('REMOVE_FROM_CART', productId);
        },
        updateCartQuantity({ commit }, { productId, quantity }) {
            commit('UPDATE_CART_QUANTITY', { productId, quantity });
        },
        clearCart({ commit }) {
            commit('CLEAR_CART');
        },
        async createOrder({ commit, state }) {
            console.log('createOrder: состояние корзины=', state.cart);
            console.log('createOrder: длина корзины=', state.cart.length);
            
            if (state.cart.length === 0) {
                throw new Error('Корзина пуста');
            }
            try {
                // Сохраняем корзину в sessionStorage перед отправкой заказа
                sessionStorage.setItem('cart', JSON.stringify(state.cart));
                console.log('Сохранено в sessionStorage:', sessionStorage.getItem('cart'));
                
                // Отправляем пустой запрос - сервер берёт корзину из sessionStorage
                const response = await createOrder();
                console.log('Ответ сервера:', response);
                commit('CLEAR_CART');
                // Сервер может возвращать данные напрямую или в поле data
                const orderResult = response.data || response;
                commit('SET_ORDERS', [orderResult, ...state.orders]);
                return true;
            } catch (error) {
                console.error('Create order failed:', error);
                throw error;
            }
        },
        async loadOrders({ commit }) {
            try {
                const response = await getOrders();
                commit('SET_ORDERS', response.data);
                return true;
            } catch (error) {
                console.error('Load orders failed:', error);
                throw error;
            }
        }
    },
    modules: {}
})
