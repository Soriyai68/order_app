import { createRouter, createWebHistory } from 'vue-router'
import { Meteor } from 'meteor/meteor'
import Dashboard from "../views/Dashboard.vue"
import AppLayout from "../layout/AppLayout.vue"
import LoginLayout from "../layout/LoginLayout.vue"
import Login from "../views/Login.vue"
import NotFoundLayout from "../layout/NotFound.vue"
import NotFound from "../views/NotFound.vue"


const routes = [
  { path: '/', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true, layout: AppLayout } },
  { path: '/login', name: 'login', component: Login, meta: { requiresAuth: false, layout: LoginLayout } },
  { path: '/not-found', name: 'not-found', component: NotFound, meta: { requiresAuth: true, layout: NotFoundLayout } },
  { path: '/singup', name: 'signup', component: () => import('../views/Signup.vue'), meta: { requiresAuth: false, layout: LoginLayout } },
  { path: '/inventory/unit', name: 'unit', component: () => import('../views/Inventory/Unit.vue'), meta: { requiresAuth: true, layout: AppLayout } },
  { path: '/inventory/brand', name: 'brand', component: () => import('../views/Inventory/Brand.vue'), meta: { requiresAuth: true, layout: AppLayout } },
  { path: '/inventory/category', name: 'category', component: () => import('../views/Inventory/Category.vue'), meta: { requiresAuth: true, layout: AppLayout } },
  { path: '/management/product', name: 'product', component: () => import('../views/Management/Product.vue'), meta: { requiresAuth: true, layout: AppLayout } },
  { path: '/management/opening_stock', name: 'opening_stock', component: () => import('../views/Management/OpeningStock.vue'), meta: { requiresAuth: true, layout: AppLayout } },
  { path: '/operation/place_order', name: 'place_order', component: () => import('../views/Operations/Place.vue'), meta: { requiresAuth: true, layout: AppLayout } },
  { path: '/operation/customer', name: 'customer', component: () => import('../views/Operations/Customer.vue'), meta: { requiresAuth: true, layout: AppLayout } },
  { path: '/operation/pos', name: 'pos', component: () => import('../views/Operations/POS.vue'), meta: { requiresAuth: true, layout: AppLayout } },
  { path: '/operation/selllist', name: 'history_sell', component: () => import('../views/Operations/HistorySell.vue'), meta: { requiresAuth: true, layout: AppLayout } },
  { path: '/user', name: 'user', component: () => import('../views/User.vue'), meta: { requiresAuth: true, layout: AppLayout } },
  { path: '/operation/profile', name: 'profile', component: () => import('../views/Profile.vue'), meta: { requiresAuth: false, layout: AppLayout } },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!Meteor.userId();
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'login' });
  } else if ((to.name === 'login' || to.name === 'signup') && isLoggedIn) {
    // Redirect to dashboard after login/signup if already logged in
    next({ name: 'dashboard' });
  } else {
    next();
  }
});
