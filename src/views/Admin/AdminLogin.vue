<template>
  <div>
    <h2>Admin Login</h2>

    <button @click="login">Login as Admin</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const login = () => {
  localStorage.setItem('admin', 'true')
  router.push('/admin')
}
</script>
