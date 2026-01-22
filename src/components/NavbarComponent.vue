<template>
  <nav class="navbar">
    <img src="@/assets/logo.png" class="logo" />

    <router-link to="/">Home</router-link>
    <router-link to="/student">Student</router-link>
    <router-link to="/about">About</router-link>

    <router-link to="/admin/login" class="admin-link">
      Admin
    </router-link>
  </nav>
</template>
