import {createStore} from 'vuex'
import {addToCart, login as apiLogin} from "@/utils/api";
import {register as apiRegister} from "@/utils/api";
import {getProducts,} from "@/utils/api";
import {
    addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart,
    getCart as apiGetCart, updateCartQuantity as apiUpdateQuantity
} from "@/utils/api";
import {createOrder as apiCreateOrder, getOrders as apiGetOrders} from '@/utils/api';

export default createStore({
    state: {
        token: localStorage.getItem("user_token") || null,
        user: null,
        products: [],
        cart: JSON.parse(localStorage.getItem("cart")) || [],
        orders: [],
        loading: false,
        error: null,
    },
    getters: {
        isAuthenticated: state => !!state.token,
        products: state => state.products,
        isLoading: state => state.loading,
        error: state => state.error,
        orders: state => state.orders,
        cart: state => Array.isArray(state.cart) ? state.cart : [],
        cartTotal: state => {
            const cart = Array.isArray(state.cart) ? state.cart : [];
            return cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
        },
        cartCount: state => {
            const cart = Array.isArray(state.cart) ? state.cart : [];
            return cart.reduce((count, item) => count + (item.quantity || 1), 0);
        },
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
        SET_PRODUCTS(state, products) {
            state.products = products;
        },
        SET_LOADING(state, loading) {
            state.loading = loading;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
        SET_CART(state, cartItems) {
            state.cart = Array.isArray(cartItems) ? [...cartItems] : [];
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        ADD_TO_CART(state, product) {
            const productId = product.id || product.productId;
            if (!productId) {
                console.error('Нет id у продукта:', product);
                return;
            }
            const existingItem = state.cart.find(item => (item.id || item.productId) === productId);
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
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
        },
        REMOVE_FROM_CART(state, productId) {
            state.cart = state.cart.filter(item => item.id !== productId);
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        UPDATE_CART_QUANTITY(state, {productId, quantity}) {
            const item = state.cart.find(item => item.id === productId);
            if (item) {
                if (quantity <= 0) {
                    state.cart = state.cart.filter(item => item.id !== productId);
                } else {
                    item.quantity = quantity;
                }
                localStorage.setItem("cart", JSON.stringify(state.cart));
            }
        },
        CLEAR_CART(state) {
            state.cart = [];
            localStorage.removeItem("cart");
        },
        SET_ORDERS(state, orders) {
            state.orders = orders;
        },
        ADD_ORDER (state, order) {
            state.orders.unshift(order);
        },

    },
    actions: {
        async createOrder({ commit, state, getters }) {

            if (getters.cartCount === 0) {
                throw new Error('Корзина пуста. Невозможно оформить заказ.');
            }
            try {
                const response = await apiCreateOrder();

                if (!response.data || typeof response.data.order_id !== 'number') {
                    throw new Error('Некорректный ответ сервера при оформлении заказа');
                }

                commit('CLEAR_CART');
                commit('ADD_ORDER', response.data);

                console.log('Заказ успешно оформлен (Store):', response.data.message);

                return response.data;

            } catch (error) {
                console.error('Create order failed (Store):', error);
                throw error;
            }
        },
        async loadOrders({ commit, getters }) {
            // Проверяем, авторизован ли пользователь
            if (!getters.isAuthenticated) {
                throw new Error('Необходимо авторизоваться для просмотра заказов.');
            }

            try {

                const response = await apiGetOrders();

                if (!response.data || !Array.isArray(response.data)) {
                    throw new Error('Некорректный ответ сервера при загрузке заказов');
                }

                // Обновляем состояние заказов
                commit('SET_ORDERS', response.data);

                console.log('Заказы успешно загружены (Store)');

                return response.data;

            } catch (error) {
                console.error('Load orders failed (Store):', error);

                throw error;
            }
        },
        async loadCart({commit, getters}) {
            if (!getters.isAuthenticated) {

                return;
            }
            try {
                const response = await apiGetCart();
                const groupedCart = response.data.reduce((acc, item) => {
                    const existingGroup = acc.find(i => i.productId === item.product_id);
                    if (existingGroup) {
                        existingGroup.quantity += 1;

                    } else {
                        acc.push({
                            id: item.id,
                            productId: item.product_id,
                            name: item.name,
                            price: item.price,
                            description: item.description,
                            image: item.image,
                            quantity: 1,
                            items: [item]
                        });
                    }
                    return acc;
                }, []);

                commit('SET_CART', groupedCart);
            } catch (error) {
                console.error('Load cart failed:', error);
                throw error;
            }
        },
        async addToCart({dispatch}, productId) {
            try {
                await apiAddToCart(productId);

                await dispatch('loadCart');
            } catch (error) {
                console.error('Add to cart failed:', error);
                throw error;
            }
        },
        async removeFromCart({dispatch}, cartItemId) {
            try {
                await apiRemoveFromCart(cartItemId);

                await dispatch('loadCart');
            } catch (error) {
                console.error('Remove from cart failed:', error);
                throw error;
            }
        },
        async updateCartQuantity({dispatch}, {cartItemId, quantity}) { // cartItemId - это id записи в корзине
            if (quantity <= 0) {
                await dispatch('removeFromCart', cartItemId);
                return;
            }
            const response = await apiGetCart();
            const currentItems = response.data.filter(item => item.product_id === productId);
            const currentQuantity = currentItems.length;

            const promises = [];
            if (quantity > currentQuantity) {
                for (let i = 0; i < quantity - currentQuantity; i++) {
                    promises.push(apiAddToCart(productId));
                }
            } else if (quantity < currentQuantity) {

                for (let i = 0; i < currentQuantity - quantity; i++) {
                    promises.push(apiRemoveFromCart(currentItems[i].id));
                }
            }
            await Promise.all(promises);
            await dispatch('loadCart');
        },
        async loadProducts({commit}) {
            commit("SET_LOADING", true);
            commit("SET_ERROR", null);

            try {
                const res = await getProducts();
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
        async login({commit}, {email, password}) {
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
        async logout({commit}) {
            commit('ClEAR_AUTH');
        },
        async register({commit}, {fio, email, password}) {
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
    },
    modules: {}
})
