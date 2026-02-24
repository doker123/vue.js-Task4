import {createRouter, createWebHistory} from 'vue-router'
import store from "@/store";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/HomeView.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue'),
        meta: {guestOnly: true}
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/RegisterView.vue'),
        meta: {guestOnly: true}
    },
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('../views/CartView.vue'),
        meta: {authRequired: true}
    },
    {
        path: '/orders',
        name: 'Orders',
        component: () => import('../views/OrdersView.vue'),
        meta: {authRequired: true}
    }
]
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})


router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters.isAuthenticated;

    if (to.meta.authRequired && !isAuthenticated) {
        next({name: 'Login'});
    } else if (to.meta.guestOnly && isAuthenticated) {
        next({name: 'Home'});
    } else {
        next();
    }
});

export default router