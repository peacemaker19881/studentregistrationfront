<template>
  <nav class="navbar">
    <img src="@/assets/logo.png" class="logo" />
<button class="menu-toggle" @click="open = !open">☰</button>

<ul :class="{ open }">
  <li><router-link to="/">Home</router-link></li>
  <li><router-link to="/student">Student</router-link></li>
  <li><router-link to="/about">About</router-link></li>
</ul>

    <router-link to="/admin/login" class="admin-link">
      Admin
    </router-link>
  </nav>
</template>

<style  scoped>
.menu-toggle {
  display: none;
  font-size: 24px;
  background: none;
  border: none;
  color: white;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  ul {
    flex-direction: column;
    display: none;
  }

  ul.open {
    display: flex;
  }
}
</style>
