import { createStore } from 'vuex'
import { login } from "@/utils/api";
import { register as apiRegister } from "@/utils/api";
import { getProducts } from "@/utils/api";

export default createStore({
    state: {
        token: localStorage.getItem("user_token") || null,
        user: null,
        products: [],
        cart: []

    },
    getters: {
        isAuthenticated: state => !!state.token,
        products: state => state.products,
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
        }
    },
    actions: {
        async login({ commit}, {email, password}) {
            try {
                const response = await login(email, password);
                commit("SET_TOKEN", response.data.token);
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
                commit('SET_TOKEN', response.data.token);
                return true;
            } catch (error) {
                console.error('Register failed:', error);
                if(error.errors) {
                    throw error;
                } else {
                    throw { message: error.message || 'Ошибка регистрации'}
                }
            }
        }
    },
    modules: {}
})
