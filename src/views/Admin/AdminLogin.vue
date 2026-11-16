<template>
  <div class="admin-login">
    <form @submit.prevent="login">
      <h2>Admin Login</h2>
      <label for="admin-email">Email</label>
      <input id="admin-email" v-model="email" type="email" autocomplete="username" required />
      <label for="admin-password">Password</label>
      <input id="admin-password" v-model="password" type="password" autocomplete="current-password" required />
      <button type="submit" :disabled="loading">{{ loading ? "Signing in..." : "Sign in" }}</button>
      <p v-if="error" role="alert">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router'
import { api } from "@/services/api";

const router = useRouter()
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const login = async () => {
  loading.value = true;
  error.value = "";
  try {
    const { data } = await api.post("/auth/login", { email: email.value, password: password.value });
    if (data.user.role !== "admin") {
      error.value = "This account does not have administrator access.";
      return;
    }
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("admin", "true");
    router.push("/admin");
  } catch (err) {
    error.value = err.response?.data?.message || "Unable to sign in.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 65vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

form {
  display: grid;
  gap: 12px;
  width: min(100%, 380px);
  padding: 28px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, .12);
}

input, button {
  min-height: 42px;
  padding: 8px 12px;
  font: inherit;
}

button {
  border: 0;
  border-radius: 6px;
  color: white;
  background: #0f4c75;
  cursor: pointer;
}

p {
  color: #b42318;
}
</style>
