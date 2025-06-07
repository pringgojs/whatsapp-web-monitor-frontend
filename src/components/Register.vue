<template>
  <div class="register-container">
    <nav class="breadcrumb">
      <router-link to="/">Home</router-link> / Register
    </nav>
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Password</label>
        <input v-model="password" type="password" required />
      </div>
      <div>
        <label>Role</label>
        <select v-model="role" required>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
      <button type="submit">Register</button>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="success" class="success">{{ success }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const role = ref("user");
const error = ref("");
const success = ref("");
const router = useRouter();

const handleRegister = async () => {
  error.value = "";
  success.value = "";
  try {
    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        role: role.value,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      success.value = "Registrasi berhasil. Silakan login.";
      setTimeout(() => router.push("/login"), 1200);
    } else {
      error.value = data.error || "Registrasi gagal";
    }
  } catch (e) {
    error.value = "Terjadi kesalahan koneksi";
  }
};
</script>

<style scoped>
.register-container {
  max-width: 350px;
  margin: 60px auto;
  padding: 2rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: var(--login-bg, #fff);
}
form > div {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: bold;
}
input,
select {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
button {
  width: 100%;
  padding: 0.7rem;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 0.5rem;
}
button:hover {
  background: #369870;
}
.error {
  color: #e74c3c;
  margin-top: 1rem;
}
.success {
  color: #27ae60;
  margin-top: 1rem;
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
  .register-container {
    background: #23272f;
    color: #fff;
    border-color: #444;
  }
  input,
  select {
    background: #23272f;
    color: #fff;
    border-color: #444;
  }
  label {
    color: #fff;
  }
  button {
    background: #369870;
    color: #fff;
  }
  .error {
    color: #ff7675;
  }
  .success {
    color: #27ae60;
  }
  .breadcrumb a {
    color: #7fffd4;
  }
}
</style>
