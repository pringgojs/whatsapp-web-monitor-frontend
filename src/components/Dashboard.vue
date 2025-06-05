<template>
  <div>
    <nav class="navbar">
      <ul>
        <li><router-link to="/">Dashboard</router-link></li>
        <li><router-link to="/scan-qr">Scan QR Code</router-link></li>
        <li><router-link to="/status">Cek Status Client</router-link></li>
        <li><a href="#" @click.prevent="logout">Logout</a></li>
      </ul>
    </nav>
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <p>Selamat datang di aplikasi monitoring WhatsApp Web!</p>
      <p>Silakan pilih menu di atas untuk mulai menggunakan fitur.</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
function logout() {
  localStorage.removeItem("token");
  router.push("/login");
}
</script>

<style scoped>
.navbar {
  background: var(--navbar-bg, #23272f);
  padding: 0.5rem 0;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.navbar ul {
  display: flex;
  justify-content: center;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.navbar a,
.navbar .router-link-active {
  color: var(--navbar-link, #fff);
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  transition: color 0.2s;
}
.navbar a:hover,
.navbar .router-link-exact-active {
  color: #42b983;
}
@media (prefers-color-scheme: light) {
  .navbar {
    background: var(--navbar-bg-light, #fff);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
  .navbar a,
  .navbar .router-link-active {
    color: var(--navbar-link-light, #23272f);
  }
}
.dashboard-container {
  max-width: 700px;
  margin: 40px auto;
  padding: 2rem;
  background: var(--dashboard-bg, #fff);
  border-radius: 10px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  text-align: center;
}
@media (prefers-color-scheme: dark) {
  .dashboard-container {
    background: var(--dashboard-bg-dark, #23272f);
    color: #fff;
  }
}
</style>
