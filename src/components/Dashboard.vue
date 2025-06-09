<template>
  <div>
    <!-- Hapus navbar lama di sini, hanya tampilkan konten dashboard utama -->
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
import { ref } from "vue";
const router = useRouter();
const isAdmin = ref(false);
try {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    isAdmin.value = payload.role === "admin";
  }
} catch {}
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
