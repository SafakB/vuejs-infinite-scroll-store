import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ProductDetail from '../views/ProductDetail.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/product/:id',
            name: 'product-detail',
            component: ProductDetail,
            props: true
        }
    ]
    // scrollBehavior'ı tamamen kaldırdık
})

export default router
