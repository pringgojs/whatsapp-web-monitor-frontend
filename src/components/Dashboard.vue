<template>
  <div>
    <nav class="navbar">
      <ul>
        <li><router-link to="/">Dashboard</router-link></li>
        <li><router-link to="/scan-qr">Scan QR Code</router-link></li>
        <li><router-link to="/status">Cek Status Client</router-link></li>
        <li><router-link to="/clients">Daftar Client</router-link></li>
        <li><a href="#" @click.prevent="logout">Logout</a></li>
      </ul>
    </nav>
    <div class="dashboard-container">
      <nav class="breadcrumb">
        <router-link to="/">Home</router-link> / Dashboard
      </nav>
      <h1>Dashboard</h1>
      <p>Selamat datang di aplikasi monitoring WhatsApp Web!</p>
      <p>Silakan pilih menu di atas untuk mulai menggunakan fitur.</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { API_BASE_URL } from "../config";
const router = useRouter();
function logout() {
  localStorage.removeItem("token");
  router.push("/login");
}
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
const fetchSummary = async () => {
  loading.value = true;
  error.value = "";
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      headers: { ...getAuthHeaders() },
    });
    const data = await response.json();
    if (response.ok && data.sessions) {
      clients.value = data.sessions;
    } else {
      error.value = data.error || "Gagal memuat data.";
    }
  } catch (e) {
    error.value = "Gagal memuat data.";
  } finally {
    loading.value = false;
  }
};
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
  .breadcrumb a {
    color: #7fffd4;
  }
  .dashboard-container {
    background: var(--dashboard-bg-dark, #23272f);
    color: #fff;
  }
}
</style>
