<template>
  <div class="notfound-container">
    <img src="@/assets/bumba.png" alt="School Logo" class="logo" />

    <h1>404 – Page Not Found</h1>

    <p>
      The page you are trying to access does not exist or you are not allowed
      to view it.
    </p>

    <div class="actions">
      <router-link to="/" class="btn">Go to Home</router-link>
      <router-link to="/student" class="btn">Student Registration</router-link>
      <router-link to="/about" class="btn">About Us</router-link>
    </div>
  </div>
</template>

<script setup>
/* No logic needed */
</script>

<style scoped>
.notfound-container {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.logo {
  width: 100px;
  margin-bottom: 20px;
}

.actions {
  margin-top: 20px;
}

.btn {
  margin: 0 10px;
  padding: 10px 20px;
  background: #2c3e50;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}

.btn:hover {
  background: #1a252f;
}
</style>
