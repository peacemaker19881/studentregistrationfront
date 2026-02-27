import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue';
import StudentRegister from '@/views/StudentRegister.vue';
import AboutView from '@/views/AboutView.vue';
import UploadDocuments from '@/components/UploadDocuments.vue';
import CommentsComponents from '@/components/CommentsComponents.vue';
import AdminLogin from '@/views/Admin/AdminLogin.vue';
import AdminDashboard from '@/views/Admin/AdminDashboard.vue';
import LoginComponent from '@/views/LoginComponent.vue';
import ViewDocuments from '@/components/ViewDocuments.vue';
import NotFound from '@/views/NotFound.vue';

// Temporary fake auth (frontend only)
const isAdminAuthenticated = () => {
  return localStorage.getItem('admin') === 'true'
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/student',
    name: 'student',
    component: StudentRegister
  },
  {
    path: '/upload',
    name: 'upload',
    component: UploadDocuments
  },
  {
    path: '/comments',
    name: 'comments',
    component: CommentsComponents
  },
  {
    path: '/Login',
    name: 'Login',
    component: LoginComponent
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/Documents',
    name: 'Documents',
    component: ViewDocuments
  },
    {
    path: '/admin/login',
    name: 'admin',
    component: AdminLogin
  },
  {
  path: "/admin/news",
  component: () => import("../views/AdminNews.vue"),
  meta: { requiresAdmin: true }
},
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: AdminDashboard,
    //meta: { requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/* GLOBAL GUARD */
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin && !isAdminAuthenticated()) {
    next('/admin/login')
  } else {
    next()
  }
})

export default router
