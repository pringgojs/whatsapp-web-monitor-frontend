<template>
  <div class="login-container">
    <nav class="breadcrumb"><router-link to="/">Home</router-link> / Login</nav>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Password</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Login</button>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { API_BASE_URL } from "../config";

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const handleLogin = async () => {
  error.value = "";
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });
    const data = await response.json();
    if (response.ok && data.token) {
      localStorage.setItem("token", data.token);
      router.push("/");
    } else {
      error.value = data.message || "Login gagal";
    }
  } catch (e) {
    error.value = "Terjadi kesalahan koneksi";
  }
};
</script>

<style scoped>
.login-container {
  max-width: 350px;
  margin: 60px auto;
  padding: 2rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: var(--login-bg, #fff);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}
.login-container h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--login-title, #333);
}
.login-container label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--login-label, #555);
}
.login-container input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: var(--login-input-bg, #f9f9f9);
  color: var(--login-input-color, #222);
}
.login-container button {
  width: 100%;
  padding: 0.7rem;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.login-container button:hover {
  background: #369870;
}
.error {
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
}
.breadcrumb {
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}
.breadcrumb a {
  color: #42b983;
  text-decoration: none;
}
.breadcrumb a:hover {
  text-decoration: underline;
}
@media (prefers-color-scheme: dark) {
  .login-container {
    background: var(--login-bg-dark, #23272f);
    border-color: #333;
  }
  .login-container h2 {
    color: var(--login-title-dark, #fff);
  }
  .login-container label {
    color: var(--login-label-dark, #ccc);
  }
  .login-container input {
    background: var(--login-input-bg-dark, #181a20);
    color: var(--login-input-color-dark, #fff);
    border-color: #444;
  }
  .breadcrumb a {
    color: #7fffd4;
  }
}
</style>
