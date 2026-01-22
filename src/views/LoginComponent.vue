<template>
  <div class="login-container">
    <form class="login-card">
      <h2 class="title">User Login</h2>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          name="Email"
          placeholder="Enter your email"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          name="Password"
          placeholder="Enter your password"
        />
      </div>

      <button type="submit" class="login-btn">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "LoginComponent",
};
</script>

<style scoped>
/* Page background and centering */
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #4f46e5, #06b6d4);
  font-family: Arial, Helvetica, sans-serif;
}

/* Card */
.login-card {
  background: #ffffff;
  padding: 20px 25px;
  width: 350px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Title */
.title {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}

/* Form groups */
.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
}

/* Inputs */
.form-group input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #4f46e5;
}

/* Button */
.login-btn {
  width: 100%;
  padding: 12px;
  background: #4f46e5;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.login-btn:hover {
  background: #4338ca;
}
</style>
